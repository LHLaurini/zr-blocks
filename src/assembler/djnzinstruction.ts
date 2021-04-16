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

    assemble(): number {
        return 0b1110 << 12 | this.encodeOperands(allowed, this.reg, this.target);
    }
}
