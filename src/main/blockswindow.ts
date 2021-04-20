import { BrowserWindow, dialog, ipcMain, Menu } from "electron";
import { protect } from "../common/protect";
import { join, basename } from 'path';
import { MenuAction } from "../common/menuaction";
import { writeFile } from 'fs/promises';
import Settings from 'electron-settings';
import { VM } from "vm2";
import { exceptionToString } from "../common/error";
import * as assembler from "../assembler/assembler";
import * as stdlib from "../stdlib/stdlib";
import { Block } from "../assembler/assembler";
import { Linker } from "../assembler/linker";

type CurrentFile = Readonly<{ changed: boolean, filename: string | null }>;
type WindowState = { x: number | undefined, y: number | undefined, width: number, height: number };
type DefinedWindowState = { x: number, y: number, width: number, height: number };

const TITLE = "ZR Blocks";
const FILTERS = [{ name: "ZRB", extensions: ["zrb"] }];
const DEFAULT_STATE: WindowState = { x: undefined, y: undefined, width: 800, height: 600 };
const UNTITLED = "Sem título";

export class BlocksWindow {
    private browserWindow: BrowserWindow;
    private menu: Menu;
    private mustClose: boolean;
    private _currentFile: CurrentFile;

    public get currentFile(): CurrentFile {
        return this._currentFile;
    }

    public set currentFile(v: CurrentFile) {
        this._currentFile = v;
        this.updateTitle();
    }

    public constructor(file: string | null = null) {
        const template: Array<(Electron.MenuItemConstructorOptions) | (Electron.MenuItem)> = [
            {
                label: "&Arquivo",
                submenu: [
                    {
                        label: "&Novo",
                        accelerator: "Ctrl+N",
                        click: () => protect(() => this.new_())
                    },
                    {
                        label: "&Abrir...",
                        accelerator: "Ctrl+O",
                        click: () => protect(() => this.open())
                    },
                    {
                        type: "separator"
                    },
                    {
                        label: "&Salvar",
                        accelerator: "Ctrl+S",
                        click: () => protect(() => this.save())
                    },
                    {
                        label: "Sa&lvar como...",
                        accelerator: "Ctrl+Shift+S",
                        click: () => protect(() => this.saveAs())
                    },
                    {
                        type: "separator"
                    },
                    {
                        label: "Sa&ir",
                        accelerator: "Ctrl+Q",
                        click: () => protect(() => this.quit())
                    }
                ]
            },
            {
                label: "&Editar",
                submenu: [
                    {
                        label: "&Desfazer",
                        accelerator: "Ctrl+Z",
                        click: () => protect(() => this.undo()),
                        registerAccelerator: false
                    },
                    {
                        label: "&Refazer",
                        accelerator: "Ctrl+Y",
                        click: () => protect(() => this.redo()),
                        registerAccelerator: false
                    },
                    {
                        type: "separator"
                    },
                    {
                        label: "R&ecortar",
                        accelerator: "Ctrl+X",
                        click: () => protect(() => this.cut()),
                        registerAccelerator: false
                    },
                    {
                        label: "&Copiar",
                        accelerator: "Ctrl+C",
                        click: () => protect(() => this.copy()),
                        registerAccelerator: false
                    },
                    {
                        label: "C&olar",
                        accelerator: "Ctrl+V",
                        click: () => protect(() => this.paste()),
                        registerAccelerator: false
                    },
                    {
                        label: "&Apagar",
                        accelerator: "Delete",
                        click: () => protect(() => this.delete_()),
                        registerAccelerator: false
                    }
                ]
            },
            {
                label: "E&xibir",
                submenu: [
                    {
                        label: "&Aumentar zoom",
                        accelerator: "Ctrl+=",
                        click: () => protect(() => this.zoomIn())
                    },
                    {
                        label: "&Diminuir zoom",
                        accelerator: "Ctrl+-",
                        click: () => protect(() => this.zoomOut())
                    },
                    {
                        label: "&Zoom para caber",
                        accelerator: "Ctrl+0",
                        click: () => protect(() => this.zoomToFit())
                    },
                    {
                        role: "toggleDevTools"
                    }
                ]
            },
            {
                label: "&Blocos",
                submenu: [
                    {
                        label: "&Gerar código",
                        click: () => protect(() => this.generate())
                    },
                    {
                        label: "&Compilar",
                        accelerator: "F7",
                        click: () => protect(() => this.compile())
                    }
                ]
            },
            {
                label: "A&juda",
                submenu: [
                    {
                        label: "Sobre"
                    }
                ]
            }
        ];

        this._currentFile = { changed: false, filename: null };
        this.mustClose = false;

        this.menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(this.menu)

        // FIXME: How should this work with multiple windows?
        let windowState;
        if (Settings.hasSync('windowState')) {
            windowState = <WindowState>Settings.getSync('windowState');
        } else {
            windowState = DEFAULT_STATE;
        }

        this.browserWindow = new BrowserWindow({
            x: windowState.x,
            y: windowState.y,
            width: windowState.width,
            height: windowState.height,
            webPreferences: {
                preload: join(__dirname, '../renderer/main.js')
            }
        });

        this.browserWindow.loadFile(join(__dirname, '../renderer/index.html'))
            .then(() => this.updateTitle());

        ipcMain.on('change', () => this.onChange());
        ipcMain.on('undo_all', () => this.onUndoAll());
        ipcMain.on('ready', () => {
            if (file != undefined) {
                this.actuallyOpenFile(file);
            }
        });

        this.browserWindow.on('close', (event) => this.onClose(event));

        this.browserWindow.setMenu(this.menu);
    }

    private updateTitle() {
        let filename: string;
        if (this.currentFile.filename != null) {
            filename = basename(this.currentFile.filename);
        } else {
            filename = UNTITLED;
        }
        this.browserWindow.setTitle(`${filename}${this.currentFile.changed ? ' *' : ''} - ${TITLE}`)
    }

    private sendToRenderer(channel: string, ...args: any[]) {
        this.browserWindow.webContents.send(channel, ...args);
    }

    private onChange() {
        this.currentFile = { changed: true, filename: this.currentFile.filename };
    }

    private onUndoAll() {
        this.currentFile = { changed: false, filename: this.currentFile.filename };
    }

    private async onClose(event: Electron.Event) {
        if (this.currentFile.changed && !this.mustClose) {
            event.preventDefault();
            if (await this.askChanges()) {
                this.mustClose = true;
                this.browserWindow.close();
            }
        } else {
            let state: DefinedWindowState = this.browserWindow.getBounds();
            Settings.setSync('windowState', state);
        }
    }

    private async askChanges() {
        const result = await dialog.showMessageBox(this.browserWindow, {
            title: "Salvar alterações",
            message: "Deseja salvar as alterações feitas?",
            buttons: ["Sim", "Não", "Cancelar"],
            normalizeAccessKeys: true,
            type: "question",
            defaultId: 0,
            cancelId: 2
        });
        switch (result.response) {
            case 0:
                if (await this.saveFile()) {
                    return true;
                } else {
                    return false;
                }

            case 1:
                return true;

            case 2:
                return false;
        }
    }

    private doMenuAction(action: MenuAction, ...args: any[]): Promise<any[]> {
        // FIXME: This is not safe if there are multiple windows
        // Eg. if a window begins saving before another one finishes

        return new Promise<any[]>((resolve, reject) => {
            this.sendToRenderer("menu", action, ...args);
            ipcMain.on("menu_reply", (_, actionReply: MenuAction, ...argsReply) => {
                if (action == actionReply) {
                    resolve(argsReply)
                } else {
                    reject();
                }
            });
        })
    }

    private async newFile() {
        if (this.currentFile.changed) {
            if (!await this.askChanges()) {
                return false;
            }
        }

        this.currentFile = { changed: false, filename: null };
        this.sendToRenderer("menu", MenuAction.NEW);
    }

    private async actuallyOpenFile(path: string) {
        let [error]: string[] = await this.doMenuAction(MenuAction.OPEN, path);
        if (error == null) {
            this.currentFile = { changed: false, filename: path };
            return true;
        } else {
            dialog.showErrorBox("Erro ao abrir", error);
            return false;
        }
    }

    private async openFile() {
        if (this.currentFile.changed) {
            if (!await this.askChanges()) {
                return false;
            }
        }

        const result = await dialog.showOpenDialog(this.browserWindow, {
            filters: FILTERS,
            title: "Abrir",
            properties: ["openFile"]
        });

        if (!result.canceled) {
            return await this.actuallyOpenFile(result.filePaths[0]);
        }

        return !result.canceled;
    }

    private async actuallySaveFile(path: string) {
        let [error]: string[] = await this.doMenuAction(MenuAction.SAVE, path)
        if (error == null) {
            this.currentFile = { changed: false, filename: path };
            return true;
        } else {
            dialog.showErrorBox("Erro ao salvar", error);
            return false;
        }
    }

    private async saveFile() {
        if (this.currentFile.filename != null) {
            return await this.actuallySaveFile(this.currentFile.filename);
        } else {
            return await this.saveFileAs();
        }
    }

    private async saveFileAs() {
        const result = await dialog.showSaveDialog(this.browserWindow, {
            filters: FILTERS,
            title: "Salvar",
            properties: ["showOverwriteConfirmation"]
        })

        if (!result.canceled && result.filePath != undefined) {
            return await this.actuallySaveFile(result.filePath);
        } else {
            return false;
        }
    }

    private new_() {
        this.newFile();
    }

    private open() {
        this.openFile();
    }

    private save() {
        this.saveFile();
    }

    private saveAs() {
        this.saveFileAs();
    }

    private quit() {
        this.browserWindow.close();
    }

    private undo() {
        this.sendToRenderer("menu", MenuAction.UNDO);
    }

    private redo() {
        this.sendToRenderer("menu", MenuAction.REDO);
    }

    private cut() {
        this.sendToRenderer("menu", MenuAction.CUT);
    }

    private copy() {
        this.sendToRenderer("menu", MenuAction.COPY);
    }

    private paste() {
        this.sendToRenderer("menu", MenuAction.PASTE);
    }

    private delete_() {
        this.sendToRenderer("menu", MenuAction.DELETE);
    }

    private zoomIn() {
        this.sendToRenderer("menu", MenuAction.ZOOM_IN);
    }

    private zoomOut() {
        this.sendToRenderer("menu", MenuAction.ZOOM_OUT);
    }

    private zoomToFit() {
        this.sendToRenderer("menu", MenuAction.ZOOM_TO_FIT);
    }

    private async error(msg: string, detail?: string) {
        await dialog.showMessageBox(this.browserWindow, {
            type: "error",
            title: "Erro",
            message: msg,
            detail: detail,
        });
    }

    private async generate() {
        let [output, error]: string[] = await this.doMenuAction(MenuAction.GENERATE);
        if (error == null) {
            if (this.currentFile.filename != null) {
                let filename = this.currentFile.filename + ".js";
                await writeFile(filename, output);
                return [output, filename];
            } else {
                dialog.showMessageBox(this.browserWindow, {
                    type: "info",
                    message: "O arquivo precisa ser salvo primeiro",
                });
            }
        } else {
            await this.error(error);
        }
    }

    private async compile() {
        let generated = await this.generate();
        if (generated != undefined && this.currentFile.filename != null) {
            try {
                const vm = new VM({
                    sandbox: { ...assembler, ...stdlib },
                });
                const mainLoop: Block = vm.run(generated[0], generated[1]);
                const linker = new Linker;
                linker.add(mainLoop, 0x000);
                stdlib.addBlocks(linker);
                await writeFile(`${generated[1]}.bin`, linker.link());
            } catch (e: unknown) {
                await this.error("Ocorreu um erro ao compilar", exceptionToString(e));
            }
        }
    }
}
