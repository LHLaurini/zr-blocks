
import Blockly from 'blockly';

const HEADER = '\
defineBlocks();\n\
\n';

const FOOTER = '\nmainLoop;'

export class Generator extends Blockly.Generator {
    // Blockly uses this=block when calling the block functions, so we have to fix it
    public high = (block: Blockly.Block) => this._high(block);
    public low = (block: Blockly.Block) => this._low(block);
    public inteiro = (block: Blockly.Block) => this._inteiro(block);
    public saida_digital = (block: Blockly.Block) => this._saida_digital(block);
    public seta_pino_digital = (block: Blockly.Block) => this._seta_pino_digital(block);
    public delay = (block: Blockly.Block) => this._delay(block);
    public sempre = (block: Blockly.Block) => this._sempre(block);

    constructor() {
        super("ASM");
    }

    ORDER_NORMAL = 0;

    private _high(_: Blockly.Block) {
        return ["HIGH", this.ORDER_NORMAL];
    }

    private _low(_: Blockly.Block) {
        return ["LOW", this.ORDER_NORMAL];
    }

    private _inteiro(block: Blockly.Block) {
        return [block.getFieldValue('valor').toString(), this.ORDER_NORMAL];
    }

    private _saida_digital(block: Blockly.Block) {
        return [block.getFieldValue('saida_digital'), this.ORDER_NORMAL];
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
