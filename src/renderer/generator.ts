
import Blockly from 'blockly';
import { UnexpectedError } from '../common/error';

const HEADER = '\
defineBlocks();\n\
memInfo = new MemInfo;\n\
let block;\n\
\n';

const FOOTER = '\nmainLoop;'

export class Generator extends Blockly.Generator {
    // Blockly uses this=block when calling the block functions, so we have to fix it
    public estado = (block: Blockly.Block) => this._estado(block);
    public inteiro = (block: Blockly.Block) => this._inteiro(block);
    public saida_digital = (block: Blockly.Block) => this._saida_digital(block);
    public pino_digital = (block: Blockly.Block) => this._pino_digital(block);
    public seta_pino_digital = (block: Blockly.Block) => this._seta_pino_digital(block);
    public delay = (block: Blockly.Block) => this._delay(block);
    public sempre = (block: Blockly.Block) => this._sempre(block);
    public controls_if = (block: Blockly.Block) => this._controls_if(block);
    public variaveis_obter_inteiro = (block: Blockly.Block) => this._variaveis_obter_inteiro(block);
    public variaveis_setar_inteiro = (block: Blockly.Block) => this._variaveis_setar_inteiro(block);
    public constante_definir_inteiro = (block: Blockly.Block) => this._constante_definir_inteiro(block);
    public operacao_binaria = (block: Blockly.Block) => this._operacao_binaria(block);

    public definitions_!: { variables: string };

    constructor() {
        super("ASM");
    }

    ORDER_NORMAL = 0;

    public init(workspace: Blockly.Workspace) {
        this.definitions_ = {
            variables: workspace.getAllVariables().filter(variable => !variable.type.endsWith('c')).reduce((accum, variable) => `${accum}const ${variable.name} = memInfo.allocVar(2);\n`, '// Variables\n') + '\n'
        };
    }

    private _estado(block: Blockly.Block) {
        return [block.getFieldValue('estado'), this.ORDER_NORMAL];
    }

    private _inteiro(block: Blockly.Block) {
        const valor = block.getFieldValue('valor') & 0xFFFF;
        return [Generator.makeImmediate(valor), this.ORDER_NORMAL];
    }

    private _saida_digital(block: Blockly.Block) {
        return [block.getFieldValue('saida_digital'), this.ORDER_NORMAL];
    }

    private _pino_digital(block: Blockly.Block) {
        let pino = this.valueToCode(block, 'pino', this.ORDER_NORMAL);
        return [`() => getDigitalInput(block, ${pino})`, this.ORDER_NORMAL];
    }

    private _seta_pino_digital(block: Blockly.Block) {
        let pino = this.valueToCode(block, 'pino', this.ORDER_NORMAL);
        let estado = this.valueToCode(block, 'estado', this.ORDER_NORMAL);
        return `setDigitalOutput(block, ${pino}, ${estado});`;
    }

    private _delay(block: Blockly.Block) {
        let millis = this.valueToCode(block, 'millis', this.ORDER_NORMAL);
        return `delayMs(block, ${millis});`;
    }

    private _sempre(block: Blockly.Block) {
        let instrucoes = this.statementToCode(block, 'instrucoes');
        return `const mainLoop = new Block();\nblock = mainLoop;\nsetup(block);\nconst start = block.label();\n${instrucoes}\nblock.jmp(start);`;
    }

    private _controls_if(block: Blockly.Block) {
        let ifs = new Array<string>();
        let dos = new Array<string>();
        let else_: string | null = null;

        for (let i = 0; block.getInput(`IF${i}`) != null; i++) {
            ifs.push(this.valueToCode(block, `IF${i}`, this.ORDER_NORMAL));
        }

        for (let i = 0; block.getInput(`DO${i}`) != null; i++) {
            dos.push(this.statementToCode(block, `DO${i}`));
        }

        if (ifs.length != dos.length) {
            throw new UnexpectedError;
        }

        if (block.getInput("ELSE") != null) {
            else_ = this.statementToCode(block, "ELSE");
        }

        const output = ["beginIf(block)"];
        output.push(...ifs.map((if_, i) => `if_(${if_}, () => {\n${dos[i]}\n})`));
        if (else_ != null) {
            output.push(`else_(() => {\n${else_}\n})`);
        }
        output.push("end()");

        return `${output.join('.')};`;
    }

    private _variaveis_obter_inteiro(block: Blockly.Block) {
        let variavel = block.workspace.getVariableById(block.getFieldValue('variavel')).name;
        return [`() => ${variavel}`, this.ORDER_NORMAL];
    }

    private _variaveis_setar_inteiro(block: Blockly.Block) {
        let variavel = block.workspace.getVariableById(block.getFieldValue('variavel')).name;
        let valor = this.valueToCode(block, 'valor', this.ORDER_NORMAL);
        return `setVar(block, ${variavel}, ${valor});`;
    }

    private _constante_definir_inteiro(block: Blockly.Block) {
        let constante = block.workspace.getVariableById(block.getFieldValue('constante')).name;
        let valor = this.valueToCode(block, 'valor', this.ORDER_NORMAL);
        return `const ${constante} = (${valor})();`;
    }

    private _operacao_binaria(block: Blockly.Block) {
        let operando1 = this.valueToCode(block, 'operando1', this.ORDER_NORMAL);
        let operacao = block.getFieldValue('operacao');
        let operando2 = this.valueToCode(block, 'operando2', this.ORDER_NORMAL);
        return [`() => ${operacao}(block, ${operando1}, ${operando2})`, this.ORDER_NORMAL];
    }

    scrub_(block: Blockly.Block, code: string, thisOnly: boolean): string {
        const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
        let nextCode: string;
        if (nextBlock != null && !thisOnly) {
            nextCode = `\n${this.blockToCode(nextBlock)}`;
        } else {
            nextCode = "";
        }
        return code + nextCode;
    }

    finish(code: string): string {
        const result = HEADER + this.definitions_.variables + code + FOOTER
        delete (this as any).definitions_;
        return result;
    }

    private static makeImmediate(value: number) {
        const numBytes = Math.max(Math.ceil(Math.log2(value + 1) / 8), 1);
        const bytes = [...Array(numBytes)].map((_, i) => `Immediate.from(${value >> (8 * i) & 0xff})`);
        return `() => [${bytes.join(", ")}]`;
    }
}
