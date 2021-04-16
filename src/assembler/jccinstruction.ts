import { Block } from "./block";
import { Instruction, Operands } from "./instruction";
import { Operand } from "./operand";

const allowed = [
    Operands.PROG,
];

export class JccInstruction extends Instruction {
    private op: number;
    private target: Operand;

    constructor(block: Block, op: number, target: Operand) {
        super(block);
        this.op = op;
        this.target = target;
        this.target.addBlockRef(block);
    }

    assemble(): number {
        // Need to do and with 0x3FF because jumps set an extra bit
        return 0b0001 << 12 | this.op << 10 | this.encodeOperands(allowed, this.target) & 0x3FF;
    }
}
