import { Block } from "./block";
import { Instruction, Operands } from "./instruction";
import { Operand } from "./operand";

const allowed = [
    Operands.PROG,
    Operands.INDIRECT_PROG,
    Operands.DOUBLE_INDIRECT_PROG,
];

export class JumpInstruction extends Instruction {
    private op: number;
    private target: Operand;

    constructor(block: Block, op: number, target: Operand) {
        super(block);
        this.op = op;
        this.target = target;
        this.target.addBlockRef(block);
    }

    assemble(): number {
        return this.op << 12 | this.encodeOperands(allowed, this.target);
    }
}
