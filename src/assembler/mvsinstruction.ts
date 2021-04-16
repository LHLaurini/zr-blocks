import { Block } from "./block";
import { Instruction, Operands } from "./instruction";
import { Operand } from "./operand";

const allowed = [
    Operands.REGISTER__IMMEDIATE_7,
];

export class MVSInstruction extends Instruction {
    private dest: Operand;
    private src: Operand;

    constructor(block: Block, dest: Operand, src: Operand) {
        super(block);
        this.dest = dest;
        this.src = src;
        this.dest.addBlockRef(block);
        this.src.addBlockRef(block);
    }

    assemble(): number {
        return 0b0011 << 12 | this.encodeOperands(allowed, this.dest, this.src);
    }
}
