
import Blockly from 'blockly';
import { ipcRenderer } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import Path from 'path';
import { IntializationError } from '../common/error';
import { MenuAction } from '../common/menuaction';
import { protect } from '../common/protect';
import { Generator } from './generator';
import { prompt, promptCallback } from './dialogs';

Blockly.Msg.CONTROLS_IF_MSG_IF = "se";
Blockly.Msg.CONTROLS_IF_IF_TITLE_IF = "se";
Blockly.Msg.CONTROLS_IF_MSG_ELSEIF = "senão, se";
Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF = "senão, se";
Blockly.Msg.CONTROLS_IF_MSG_ELSE = "senão";
Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE = "senão";
Blockly.Msg.CONTROLS_IF_MSG_THEN = "então";

Blockly.prompt = promptCallback;

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
        this.generator = new Generator;
    }

    private async init() {
        const blocklyArea = document.getElementById('blocklyArea');
        const blocks = Blocks.loadJson('blockly/blocks.json');
        const theme = Blocks.loadJson('blockly/theme.json');
        const toolbox = Blocks.loadXml('blockly/toolbox.xml');
        const variables = Blocks.loadXml('blockly/variables.xml');

        if (blocklyArea == null) {
            throw new IntializationError;
        }

        Blockly.defineBlocksWithJsonArray(await blocks);

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
            },
            theme: Blockly.Theme.defineTheme('default', await theme),
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

        const variableDom = await variables;

        this.workspace.registerToolboxCategoryCallback('VARIABLES', () => {
            if (this.workspace != undefined) {
                const buttons = variableDom.getElementsByTagName('buttons')[0].children;
                let getters = Array.from(variableDom.getElementsByTagName('getters')[0].children);
                let setters = Array.from(variableDom.getElementsByTagName('setters')[0].children);

                let elements: Element[] = [];

                elements.push(buttons[0]);

                const populateVars = (getterTypes: { [type: string]: string }, setterType?: string) => {
                    if (this.workspace != undefined && getters != undefined) {
                        const findByType = (where: Element[], type?: string) => where.find((getter) => getter.getAttribute('type') === type);
                        const variables = this.workspace.getAllVariables();
                        const firstMatch = variables.find(variable => variable.type in getterTypes);
                        if (firstMatch != undefined) {
                            const block = findByType(setters, setterType);
                            if (block != undefined) {
                                block.getElementsByTagName('field')[0].textContent = firstMatch.name;
                                elements.push(block.cloneNode(true) as Element);
                            }
                        }
                        for (let variable of variables) {
                            const block = findByType(getters, getterTypes[variable.type]);
                            if (block != undefined) {
                                let field = block.getElementsByTagName('field')[0];
                                field.setAttribute("variabletype", variable.type);
                                field.textContent = variable.name;
                                elements.push(block.cloneNode(true) as Element);
                                elements.push(variableDom.getElementsByTagName('sep')[0]);
                            }
                        }
                        if (firstMatch != undefined) {
                            elements.pop();
                        }
                    }
                };

                populateVars({ u16: "variables_get_integer", }, "variables_set_integer");

                elements.push(buttons[1]);

                populateVars({ u16c: "variables_get_integer", }, "constant_define_integer");

                elements.push(...variableDom.getElementsByTagName('constants')[0].children)

                return elements;
            }
            else {
                return [];
            }
        })

        this.workspace.registerButtonCallback('newVariablePressed', async () => {
            if (this.workspace != undefined) {
                Blockly.Variables.createVariableButtonHandler(this.workspace, undefined, 'u16');
            }
        });

        this.workspace.registerButtonCallback('newConstantPressed', async () => {
            if (this.workspace != undefined) {
                Blockly.Variables.createVariableButtonHandler(this.workspace, undefined, 'u16c');
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

    private static async loadJson(filename: string) {
        return JSON.parse(await this.loadFile(filename));
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
                Blockly.Xml.clearWorkspaceAndLoadFromXml(await Blocks.loadXml("blockly/new.xml"), this.workspace);
                Blockly.Events.enable();
                break;

            case MenuAction.OPEN:
                try {
                    Blockly.Events.disable();
                    Blockly.Xml.clearWorkspaceAndLoadFromXml(await Blocks.loadXml(file), this.workspace);
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
