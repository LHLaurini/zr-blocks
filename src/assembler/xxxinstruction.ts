import { Block } from "./block";
import { Instruction, Operands } from "./instruction";
import { Operand } from "./operand";

const allowed = [
    Operands.REGISTER__REGISTER,
    Operands.R0__IMMEDIATE,
    Operands.REGISTER__INDIRECTMEMORY,
    Operands.INDIRECT_MEMORY__REGISTER,
    Operands.INDIRECT_MEMORY__INDIRECT_MEMORY,
    Operands.R0__MEMORY,
    Operands.MEMORY__R0,
    Operands.INDIRECT_MEMORY_R0__MEMORY,
    Operands.MEMORY__INDIRECT_MEMORY_R0,
    Operands.INDIRECT_MEMORY_R0__IMMEDIATE,
    Operands.IO_ADDRESS__R0,
    Operands.R0__IO_ADDRESS,
    Operands.INDIRECT_IO__REGISTER,
    Operands.REGISTER__INDIRECT_IO,
];

abstract class XXXInstruction extends Instruction {
    private op: number;
    private dest: Operand;
    private src: Operand;

    constructor(block: Block, op: number, dest: Operand, src: Operand) {
        super(block);
        this.op = op;
        this.dest = dest;
        this.src = src;
        this.dest.addBlockRef(block);
        this.src.addBlockRef(block);
    }

    get operand1() {
        return this.dest;
    }

    get operand2() {
        return this.src;
    }

    assemble(): number {
        return this.op << 12 | Instruction.encodeOperands(allowed, this.dest, this.src);
    }
}

export class AndInstruction extends XXXInstruction {
    constructor(block: Block, dest: Operand, src: Operand) {
        super(block, 0b0100, dest, src);
    }

    get mnemonic() {
        return "and";
    }
}

export class OrInstruction extends XXXInstruction {
    constructor(block: Block, dest: Operand, src: Operand) {
        super(block, 0b0101, dest, src);
    }

    get mnemonic() {
        return "or";
    }
}

export class XorInstruction extends XXXInstruction {
    constructor(block: Block, dest: Operand, src: Operand) {
        super(block, 0b0110, dest, src);
    }

    get mnemonic() {
        return "xor";
    }
}

export class CmpInstruction extends XXXInstruction {
    constructor(block: Block, dest: Operand, src: Operand) {
        super(block, 0b0111, dest, src);
    }

    get mnemonic() {
        return "cmp";
    }
}

export class AddInstruction extends XXXInstruction {
    constructor(block: Block, dest: Operand, src: Operand) {
        super(block, 0b1000, dest, src);
    }

    get mnemonic() {
        return "add";
    }
}

export class SubInstruction extends XXXInstruction {
    constructor(block: Block, dest: Operand, src: Operand) {
        super(block, 0b1001, dest, src);
    }

    get mnemonic() {
        return "sub";
    }
}

export class MovInstruction extends XXXInstruction {
    constructor(block: Block, dest: Operand, src: Operand) {
        super(block, 0b1101, dest, src);
    }

    get mnemonic() {
        return "mov";
    }
}
