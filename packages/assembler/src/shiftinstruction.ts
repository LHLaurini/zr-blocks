import { Block } from "./block";
import { Instruction, Operands } from "./instruction";
import { Operand } from "./operand";

const allowed = [
    Operands.REGISTER__REGISTER,
    Operands.REGISTER__INDIRECTMEMORY,
    Operands.INDIRECT_MEMORY__REGISTER,
    Operands.INDIRECT_MEMORY__INDIRECT_MEMORY,
    Operands.R0__MEMORY,
    Operands.MEMORY__R0,
    Operands.INDIRECT_MEMORY_R0__MEMORY,
    Operands.MEMORY__INDIRECT_MEMORY_R0,
    Operands.IO_ADDRESS__R0,
    Operands.R0__IO_ADDRESS,
    Operands.INDIRECT_IO__REGISTER,
    Operands.REGISTER__INDIRECT_IO,
];

abstract class ShiftInstruction extends Instruction {
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

export class RotInstruction extends ShiftInstruction {
    constructor(block: Block, dest: Operand, src: Operand) {
        super(block, 0b1010, dest, src);
    }

    get mnemonic() {
        return "rot";
    }
}

export class ShlInstruction extends ShiftInstruction {
    constructor(block: Block, dest: Operand, src: Operand) {
        super(block, 0b1011, dest, src);
    }

    get mnemonic() {
        return "shl";
    }
}

export class ShaInstruction extends ShiftInstruction {
    constructor(block: Block, dest: Operand, src: Operand) {
        super(block, 0b1100, dest, src);
    }

    get mnemonic() {
        return "sha";
    }
}
