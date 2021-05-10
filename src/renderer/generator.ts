
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
    public state = (block: Blockly.Block) => this._state(block);
    public integer = (block: Blockly.Block) => this._integer(block);
    public analog_input = (block: Blockly.Block) => this._analog_input(block);
    public digital_input = (block: Blockly.Block) => this._digital_input(block);
    public digital_output = (block: Blockly.Block) => this._digital_output(block);
    public analog_pin = (block: Blockly.Block) => this._analog_pin(block);
    public digital_pin = (block: Blockly.Block) => this._digital_pin(block);
    public set_digital_pin = (block: Blockly.Block) => this._set_digital_pin(block);
    public delay = (block: Blockly.Block) => this._delay(block);
    public always = (block: Blockly.Block) => this._always(block);
    public controls_if = (block: Blockly.Block) => this._controls_if(block);
    public variables_get_integer = (block: Blockly.Block) => this._variables_get_integer(block);
    public variables_set_integer = (block: Blockly.Block) => this._variables_set_integer(block);
    public constant_define_integer = (block: Blockly.Block) => this._constant_define_integer(block);
    public unary_operation = (block: Blockly.Block) => this._unary_operation(block);
    public binary_operation = (block: Blockly.Block) => this._binary_operation(block);
    public comparison = (block: Blockly.Block) => this._binary_operation(block);
    public negation = (block: Blockly.Block) => this._negation(block);
    public logic_operation = (block: Blockly.Block) => this._binary_operation(block);
    public repeat_times = (block: Blockly.Block) => this._repeat_times(block);
    public repeat_while = (block: Blockly.Block) => this._repeat_while(block);
    public repeat_until = (block: Blockly.Block) => this._repeat_until(block);

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

    private _state(block: Blockly.Block) {
        return [block.getFieldValue('state'), this.ORDER_NORMAL];
    }

    private _integer(block: Blockly.Block) {
        const value = block.getFieldValue('value') & 0xFFFF;
        return [Generator.makeImmediate(value), this.ORDER_NORMAL];
    }

    private _analog_input(block: Blockly.Block) {
        return [block.getFieldValue('analog_input'), this.ORDER_NORMAL];
    }

    private _digital_input(block: Blockly.Block) {
        return [block.getFieldValue('digital_input'), this.ORDER_NORMAL];
    }

    private _digital_output(block: Blockly.Block) {
        return [block.getFieldValue('digital_output'), this.ORDER_NORMAL];
    }

    private _digital_pin(block: Blockly.Block) {
        let pin = this.valueToCode(block, 'pin', this.ORDER_NORMAL);
        return [`() => getDigitalInput(block, ${pin})`, this.ORDER_NORMAL];
    }

    private _analog_pin(block: Blockly.Block) {
        let pin = this.valueToCode(block, 'pin', this.ORDER_NORMAL);
        return [`() => getAnalogInput(block, ${pin})`, this.ORDER_NORMAL];
    }

    private _set_digital_pin(block: Blockly.Block) {
        let pin = this.valueToCode(block, 'pin', this.ORDER_NORMAL);
        let state = this.valueToCode(block, 'state', this.ORDER_NORMAL);
        return `setDigitalOutput(block, ${pin}, ${state});`;
    }

    private _delay(block: Blockly.Block) {
        let milliseconds = this.valueToCode(block, 'milliseconds', this.ORDER_NORMAL);
        return `delayMs(block, ${milliseconds});`;
    }

    private _always(block: Blockly.Block) {
        let statements = this.statementToCode(block, 'statements');
        return `const mainLoop = new Block();\nblock = mainLoop;\nsetup(block);\nconst start = block.label();\n${statements}\nblock.jmp(start);`;
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

    private _variables_get_integer(block: Blockly.Block) {
        let variable = block.workspace.getVariableById(block.getFieldValue('variable')).name;
        return [`() => ${variable}`, this.ORDER_NORMAL];
    }

    private _variables_set_integer(block: Blockly.Block) {
        let variable = block.workspace.getVariableById(block.getFieldValue('variable')).name;
        let value = this.valueToCode(block, 'value', this.ORDER_NORMAL);
        return `setVar(block, ${variable}, ${value});`;
    }

    private _constant_define_integer(block: Blockly.Block) {
        let constant = block.workspace.getVariableById(block.getFieldValue('constant')).name;
        let value = this.valueToCode(block, 'value', this.ORDER_NORMAL);
        return `const ${constant} = (${value})();`;
    }

    private _unary_operation(block: Blockly.Block) {
        let operation = block.getFieldValue('operation');
        let operand = this.valueToCode(block, 'operand', this.ORDER_NORMAL);
        return [`() => ${operation}(block, ${operand})`, this.ORDER_NORMAL];
    }

    private _negation(block: Blockly.Block) {
        let operand = this.valueToCode(block, 'operand', this.ORDER_NORMAL);
        return [`() => not2(block, ${operand})`, this.ORDER_NORMAL];
    }

    private _binary_operation(block: Blockly.Block) {
        let operand1 = this.valueToCode(block, 'operand1', this.ORDER_NORMAL);
        let operation = block.getFieldValue('operation');
        let operand2 = this.valueToCode(block, 'operand2', this.ORDER_NORMAL);
        return [`() => ${operation}(block, ${operand1}, ${operand2})`, this.ORDER_NORMAL];
    }

    private _repeat_times(block: Blockly.Block) {
        let times = this.valueToCode(block, 'times', this.ORDER_NORMAL);
        let statements = this.statementToCode(block, 'statements');
        return `{\n  let loopInfo = beginRepeatTimes(block, ${times});\n${statements}\n  endRepeatTimes(block, loopInfo);\n}`;
    }

    private _repeat_while(block: Blockly.Block) {
        let condition = this.valueToCode(block, 'condition', this.ORDER_NORMAL);
        let statements = this.statementToCode(block, 'statements');
        return `{\n  let loopInfo = beginRepeatWhile(block, ${condition});\n${statements}\n  endRepeatWhile(block, loopInfo);\n}`;
    }

    private _repeat_until(block: Blockly.Block) {
        let condition = this.valueToCode(block, 'condition', this.ORDER_NORMAL);
        let statements = this.statementToCode(block, 'statements');
        return `{\n  let loopInfo = beginRepeatUntil(block, ${condition});\n${statements}\n  endRepeatUntil(block, loopInfo);\n}`;
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
        const result = HEADER + this.definitions_.variables + code + FOOTER;
        delete (this as any).definitions_;
        return result;
    }

    private static makeImmediate(value: number) {
        const numBytes = Math.max(Math.ceil(Math.log2(value + 1) / 8), 1);
        const bytes = [...Array(numBytes)].map((_, i) => `Immediate.from(${value >> (8 * i) & 0xff})`);
        return `() => [${bytes.join(", ")}]`;
    }
}
