
import Blockly from 'blockly';
import { readFile, writeFile } from 'fs/promises';
import Path from 'path';
import { IntializationError, UninitializedUsageError } from './error';
import { VM } from "vm2";
import { Generator } from './generator';
import * as assembler from "zr-assembler";
import * as stdlib from "zr-stdlib";

Blockly.Msg.CONTROLS_IF_MSG_IF = "se";
Blockly.Msg.CONTROLS_IF_IF_TITLE_IF = "se";
Blockly.Msg.CONTROLS_IF_MSG_ELSEIF = "senão, se";
Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF = "senão, se";
Blockly.Msg.CONTROLS_IF_MSG_ELSE = "senão";
Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE = "senão";
Blockly.Msg.CONTROLS_IF_MSG_THEN = "então";

type OnPromptSignature = (
    message: string,
    placeholder?: string | undefined,
    callback?: ((value: string) => any) | undefined
) => Promise<string | null>;

export class Blocks {
    private static _instance: Blocks | undefined;

    public onPrompt?: OnPromptSignature;
    public onChange?: () => void;
    public onUndoAll?: () => void;

    private workspace?: Blockly.WorkspaceSvg;
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

    public get initialized() {
        return this.workspace !== undefined;
    }

    private assertInitialized() {
        if (this.workspace === undefined) {
            throw new UninitializedUsageError;
        } else {
            return this.workspace;
        }
    }

    public async init() {
        const blocklyArea = document.getElementById('blocklyArea');
        const blocks = Blocks.loadJson('blockly/blocks.json');
        const theme = Blocks.loadJson('blockly/theme.json');
        const toolbox = Blocks.loadXml('blockly/toolbox.xml');
        const variables = Blocks.loadXml('blockly/variables.xml');

        if (blocklyArea === null) {
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
                    this.onChange?.call(this);
                } else {
                    this.onUndoAll?.call(this);
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
        });

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

        Blockly.prompt = (a, b, c) => (this.onPrompt ?? (() => {
            console.error("onPrompt undefined. This is a bug.");
        }))(a, b, c);

        Blockly.svgResize(this.workspace);
    }

    public async newFile() {
        const workspace = this.assertInitialized();

        Blockly.Events.disable();
        Blockly.Xml.clearWorkspaceAndLoadFromXml(await Blocks.loadXml("blockly/new.xml"), workspace);
        Blockly.Events.enable();
    }

    public async openFile(file: string) {
        const workspace = this.assertInitialized();

        Blockly.Events.disable();
        Blockly.Xml.clearWorkspaceAndLoadFromXml(await Blocks.loadXml(file), workspace);
        Blockly.Events.enable();
    }

    public saveFile(file: string) {
        const workspace = this.assertInitialized();

        return writeFile(file, Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace)))
    }

    public undo() {
        const workspace = this.assertInitialized();

        workspace.undo(false);
    }

    public redo() {
        const workspace = this.assertInitialized();

        workspace.undo(true);
    }

    public cut() {
        this.assertInitialized();
        let block = Blockly.selected;

        if (block != null) {
            Blockly.copy(block);
            Blockly.deleteBlock(<Blockly.BlockSvg>block);
        }
    }

    public copy() {
        this.assertInitialized();
        let block = Blockly.selected;

        if (block != null) {
            Blockly.copy(block);
        }
    }

    public paste() {
        this.assertInitialized();

        Blockly.paste();
    }

    public delete() {
        this.assertInitialized();
        let block = Blockly.selected;

        if (block != null) {
            Blockly.deleteBlock(<Blockly.BlockSvg>block);
        }
    }

    public zoomIn() {
        const workspace = this.assertInitialized();

        workspace.zoomCenter(1);
    }

    public zoomOut() {
        const workspace = this.assertInitialized();

        workspace.zoomCenter(-1);
    }

    public zoomToFit() {
        const workspace = this.assertInitialized();

        workspace.zoomToFit();
    }

    public generate() {
        return this.generator.workspaceToCode(this.workspace);
    }

    public compile(generated: string, filename: string) {
        type VmOutputType = [assembler.Block, assembler.Block, assembler.Block | undefined];

        const vm = new VM({
            sandbox: { ...assembler, ...stdlib },
        });
        const [start, mainLoop, interrupt]: VmOutputType = vm.run(generated, filename);
        const linker = new assembler.Linker;
        linker.add(start, 0x000);
        linker.add(mainLoop);
        if (interrupt != undefined) {
            linker.add(interrupt, 0x3c0);
        }
        stdlib.addBlocks(linker);
        return linker.link();
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
}
