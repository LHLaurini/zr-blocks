import { Block } from "./block";
import { Instruction, Operands } from "./instruction";
import { Operand } from "./operand";

const allowed = [
    Operands.REGISTER_1234__PROG,
];

export class DJNZInstruction extends Instruction {
    private reg: Operand;
    private target: Operand;

    constructor(block: Block, reg: Operand, target: Operand) {
        super(block);
        this.reg = reg;
        this.target = target;
        this.target.addBlockRef(block);
    }

    get operand1() {
        return this.reg;
    }

    get operand2() {
        return this.target;
    }

    get mnemonic() {
        return "djnz";
    }

    assemble(): number {
        return 0b1110 << 12 | Instruction.encodeOperands(allowed, this.reg, this.target);
    }
}
