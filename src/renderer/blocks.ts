
import Blockly from 'blockly';
import { ipcRenderer } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import Path from 'path';
import { IntializationError } from '../common/error.js';
import { MenuAction } from '../common/menuaction.js';
import { protect } from '../common/protect.js';
import { Generator } from './generator.js';

export class Blocks {
    private static _instance: Blocks | undefined;

    private workspace: Blockly.WorkspaceSvg | undefined;
    private generator: Generator;

    public static get instance(): Blocks {
        if (this._instance == undefined) {
            this._instance = new Blocks;
        }
        return this._instance;
    }

    private constructor() {
        this.generator = new Generator();
    }

    private async init() {
        const blocklyArea = document.getElementById('blocklyArea');
        const blocks = Blocks.loadFile('blockly/blocks.json');
        const toolbox = Blocks.loadXml('blockly/toolbox.xml');

        if (blocklyArea == null) {
            throw IntializationError;
        }

        Blockly.defineBlocksWithJsonArray(JSON.parse(await blocks));

        const options = {
            toolbox: await toolbox,
            collapse: true,
            comments: true,
            disable: true,
            maxBlocks: Infinity,
            trashcan: true,
            horizontalLayout: false,
            toolboxPosition: 'start',
            css: true,
            media: 'https://blockly-demo.appspot.com/static/media/',
            rtl: false,
            scrollbars: true,
            sounds: true,
            oneBasedIndex: true,
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.1
            }
        };

        this.workspace = Blockly.inject(blocklyArea, options);

        this.workspace.addChangeListener((event: any) => {
            if (!event.isUiEvent && this.workspace != undefined) {
                if (this.workspace.getUndoStack().length > 0) {
                    ipcRenderer.send('change');
                } else {
                    ipcRenderer.send('undo_all');
                }
            }
        });

        ipcRenderer.on('menu', (_, ...args) => this.onMenu(...args));
        Blockly.svgResize(this.workspace);

        ipcRenderer.send('ready');
    }

    public setupEventListeners() {
        window.addEventListener('load', () => protect(() => this.init()));
    }

    private static async loadFile(filename: string) {
        try {
            let data = await readFile(filename, 'utf8');
            return data;
        } catch (exception) {
            // Try again in dist
            try {
                let data = await readFile(Path.join(__dirname, filename), 'utf8')
                console.info(`Loaded ${filename} from dist`);
                return data;
            } catch {
                throw exception;
            }
        }
    }

    private static async loadXml(filename: string) {
        return Blockly.Xml.textToDom(await this.loadFile(filename));
    }

    private async onMenu(...args: any[]) {
        if (this.workspace == undefined) {
            return;
        }

        const action: MenuAction = args[0];
        const file: string = args[1];

        let block = Blockly.selected;
        let result = null;
        let error = null;

        switch (action) {
            case MenuAction.NEW:
                Blockly.Events.disable();
                this.workspace.clear();
                Blockly.Events.enable();
                break;

            case MenuAction.OPEN:
                try {
                    Blockly.Events.disable();
                    Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.textToDom(await readFile(file, 'utf8')), this.workspace);
                    Blockly.Events.enable();
                } catch (exception) {
                    error = exception.toString();
                }
                ipcRenderer.send("menu_reply", action, error);
                break;

            case MenuAction.SAVE:
            case MenuAction.SAVE_AS:
                try {
                    await writeFile(file, Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(this.workspace)));
                } catch (exception) {
                    error = exception.toString();
                }
                ipcRenderer.send("menu_reply", action, error);
                break;

            case MenuAction.UNDO:
                this.workspace.undo(false);
                break;

            case MenuAction.REDO:
                this.workspace.undo(true);
                break;

            case MenuAction.CUT:
                if (block != null) {
                    Blockly.copy(block);
                    Blockly.deleteBlock(<Blockly.BlockSvg>block);
                }
                break;

            case MenuAction.COPY:
                if (block != null) {
                    Blockly.copy(block);
                }
                break;

            case MenuAction.PASTE:
                Blockly.paste();
                break;

            case MenuAction.DELETE:
                if (block != null) {
                    Blockly.deleteBlock(<Blockly.BlockSvg>block);
                }
                break;

            case MenuAction.ZOOM_IN:
                this.workspace.zoomCenter(1);
                break;

            case MenuAction.ZOOM_OUT:
                this.workspace.zoomCenter(-1);
                break;

            case MenuAction.ZOOM_TO_FIT:
                this.workspace.zoomToFit();
                break;

            case MenuAction.GENERATE:
                try {
                    result = this.generator.workspaceToCode(this.workspace);
                } catch (exception: unknown) {
                    error = exception;
                }
                ipcRenderer.send("menu_reply", action, result, error);
                break;

            default:
                console.warn("MenuAction not handled!");
        }
    }
}
