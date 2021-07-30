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

abstract class IncDecInstruction extends Instruction {
    private op: number;
    private dest: Operand;

    constructor(block: Block, op: number, dest: Operand) {
        super(block);
        this.op = op;
        this.dest = dest;
        this.dest.addBlockRef(block);
    }

    get operand1() {
        return this.dest;
    }

    assemble(): number {
        return 0b1111 << 12 | this.op << 8 | Instruction.encodeOperands(allowed, this.dest);
    }
}

export class IncInstruction extends IncDecInstruction {
    constructor(block: Block, dest: Operand) {
        super(block, 0b0, dest);
    }

    get mnemonic() {
        return "inc";
    }
}

export class DecInstruction extends IncDecInstruction {
    constructor(block: Block, dest: Operand) {
        super(block, 0b1, dest);
    }

    get mnemonic() {
        return "dec";
    }
}
