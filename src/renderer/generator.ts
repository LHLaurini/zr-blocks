
import Blockly from 'blockly';
import { UnexpectedError } from '../common/error';

const HEADER = '\
defineBlocks();\n\
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

    constructor() {
        super("ASM");
    }

    ORDER_NORMAL = 0;

    private _estado(block: Blockly.Block) {
        return [block.getFieldValue('estado'), this.ORDER_NORMAL];
    }

    private _inteiro(block: Blockly.Block) {
        const valor = block.getFieldValue('valor') & 0xFFFF;
        let valorStr: string;
        if (valor > 255) {
            valorStr = `Immediate.from(${valor & 0xff}), Immediate.from(${valor >> 8})`
        } else {
            valorStr = `Immediate.from(${valor})`
        }
        return [`() => [${valorStr}]`, this.ORDER_NORMAL];
    }

    private _saida_digital(block: Blockly.Block) {
        return [block.getFieldValue('saida_digital'), this.ORDER_NORMAL];
    }

    private _pino_digital(block: Blockly.Block) {
        let pino = this.valueToCode(block, 'pino', this.ORDER_NORMAL);
        return [`() => getDigitalInput(mainLoop, ${pino})`, this.ORDER_NORMAL];
    }

    private _seta_pino_digital(block: Blockly.Block) {
        let pino = this.valueToCode(block, 'pino', this.ORDER_NORMAL);
        let estado = this.valueToCode(block, 'estado', this.ORDER_NORMAL);
        return `setDigitalOutput(mainLoop, ${pino}, ${estado});`;
    }

    private _delay(block: Blockly.Block) {
        let millis = this.valueToCode(block, 'millis', this.ORDER_NORMAL);
        return `delayMs(mainLoop, ${millis});`;
    }

    private _sempre(block: Blockly.Block) {
        let instrucoes = this.statementToCode(block, 'instrucoes');
        return `const mainLoop = new Block();\nconst start = mainLoop.label();\n${instrucoes}\nmainLoop.jmp(start);`;
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

        const output = ["beginIf(mainLoop)"];
        output.push(...ifs.map((if_, i) => `if_(${if_}, () => {\n${dos[i]}\n})`));
        if (else_ != null) {
            output.push(`else_(() => {\n${else_}\n})`);
        }
        output.push("end()");

        return `${output.join('.')};`;
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
        return HEADER + code + FOOTER;
    }
}
