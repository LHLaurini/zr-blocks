import { Block } from "./block";
import { Instruction } from "./instruction";

export class RetxInstruction extends Instruction {
    private op: number;

    constructor(block: Block, op: number) {
        super(block);
        this.op = op;
    }

    assemble(): number {
        return 0b001100001 << 7 | this.op;
    }
}
