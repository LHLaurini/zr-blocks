import { Block } from "./block";
import { Instruction, Operands } from "./instruction";
import { Operand } from "./operand";

const allowed = [
    Operands.REGISTER,
    Operands.INDIRECT_MEMORY,
    Operands.MEMORY,
    Operands.IO_ADDRESS,
    Operands.INDIRECT_IO,
];

export class IncDecInstruction extends Instruction {
    private op: number;
    private dest: Operand;

    constructor(block: Block, op: number, dest: Operand) {
        super(block);
        this.op = op;
        this.dest = dest;
        this.dest.addBlockRef(block);
    }

    assemble(): number {
        return 0b1111 << 12 | this.op << 8 | this.encodeOperands(allowed, this.dest);
    }
}
