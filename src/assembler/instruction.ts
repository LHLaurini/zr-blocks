import { InvalidOperandsError } from "../common/error";
import { Block } from "./block";
import { DoubleIndirectProg } from "./doubleindirectprog";
import { Immediate } from "./immediate";
import { Immediate7 } from "./immediate7";
import { IndirectIO } from "./indirectio";
import { IndirectMemory } from "./indirectmemory";
import { IndirectProg } from "./indirectprog";
import { IOAddress } from "./ioaddress";
import { Memory } from "./memory";
import { Operand } from "./operand";
import { Prog } from "./prog";
import { Register } from "./register";

export enum Operands {
    PROG,
    INDIRECT_PROG,
    DOUBLE_INDIRECT_PROG,
    REGISTER,
    INDIRECT_MEMORY,
    MEMORY,
    IO_ADDRESS,
    INDIRECT_IO,
    REGISTER__REGISTER,
    REGISTER__INDIRECTMEMORY,
    R0__MEMORY,
    R0__IMMEDIATE,
    INDIRECT_MEMORY__REGISTER,
    INDIRECT_MEMORY__INDIRECT_MEMORY,
    INDIRECT_MEMORY_R0__MEMORY,
    INDIRECT_MEMORY_R0__IMMEDIATE,
    MEMORY__R0,
    MEMORY__INDIRECT_MEMORY_R0,
    IO_ADDRESS__R0,
    R0__IO_ADDRESS,
    INDIRECT_IO__REGISTER,
    REGISTER__INDIRECT_IO,
    REGISTER__IMMEDIATE_7,
    REGISTER_1234__PROG,
}

export abstract class Instruction {
    private block: Block;

    constructor(block: Block) {
        this.block = block;
    }

    public toString(): string {
        return this.mnemonic + this.getIOPrefix() + this.getOperandsAsString();
    }

    abstract assemble(): number;
    protected abstract get mnemonic(): string;
    protected get operand1(): Operand | null {
        return null;
    }
    protected get operand2(): Operand | null {
        return null;
    }

    protected static encodeOperands(allowed: Operands[], op1: Operand, op2?: Operand): number {
        if (op2 == null) {
            if (allowed.includes(Operands.PROG) &&
                op1 instanceof Prog) {
                return 0b10 << 10 | op1.prog;
            } else if (allowed.includes(Operands.INDIRECT_PROG) &&
                op1 instanceof IndirectProg) {
                return 0b00 << 10 | op1.pair << 8 | op1.indirectProg.number << 4;
            } else if (allowed.includes(Operands.DOUBLE_INDIRECT_PROG) &&
                op1 instanceof DoubleIndirectProg) {
                return 0b01 << 10 | op1.pair << 8 | op1.doubleIndirectProg.indirectMemory.number << 4;
            } else if (allowed.includes(Operands.REGISTER) &&
                op1 instanceof Register) {
                return 0b000 << 9 | op1.number << 4;
            } else if (allowed.includes(Operands.INDIRECT_MEMORY) &&
                op1 instanceof IndirectMemory) {
                return 0b010 << 9 | op1.indirectMemory.number << 4;
            } else if (allowed.includes(Operands.MEMORY) &&
                op1 instanceof Memory) {
                return 0b100 << 9 | op1.memory;
            } else if (allowed.includes(Operands.IO_ADDRESS) &&
                op1 instanceof IOAddress) {
                return 0b110 << 9 | op1.ioAddress;
            } else if (allowed.includes(Operands.INDIRECT_IO) &&
                op1 instanceof IndirectIO) {
                return 0b111 << 9 | op1.indirectIO.number << 4;
            } else {
                throw new InvalidOperandsError;
            }
        } else {
            if (allowed.includes(Operands.REGISTER__REGISTER) &&
                op1 instanceof Register && op2 instanceof Register) {
                return 0b0000 << 8 | op1.number << 4 | op2.number;
            } else if (allowed.includes(Operands.REGISTER__INDIRECTMEMORY) &&
                op1 instanceof Register && op2 instanceof IndirectMemory) {
                return 0b0001 << 8 | op1.number << 4 | op2.indirectMemory.number;
            } else if (allowed.includes(Operands.R0__MEMORY) &&
                op1 == Register.R0 && op2 instanceof Memory) {
                return 0b0010 << 8 | op2.memory;
            } else if (allowed.includes(Operands.R0__IMMEDIATE) &&
                op1 == Register.R0 && op2 instanceof Immediate) {
                return 0b0011 << 8 | op2.immediate;
            } else if (allowed.includes(Operands.INDIRECT_MEMORY__REGISTER) &&
                op1 instanceof IndirectMemory && op2 instanceof Register) {
                return 0b0100 << 8 | op1.indirectMemory.number << 4 | op2.number;
            } else if (allowed.includes(Operands.INDIRECT_MEMORY__INDIRECT_MEMORY) &&
                op1 instanceof IndirectMemory && op2 instanceof IndirectMemory) {
                return 0b0101 << 8 | op1.indirectMemory.number << 4 | op2.indirectMemory.number;
            } else if (allowed.includes(Operands.INDIRECT_MEMORY_R0__MEMORY) &&
                op1 == Register.R0.memory && op2 instanceof Memory) {
                return 0b0110 << 8 | op2.memory;
            } else if (allowed.includes(Operands.INDIRECT_MEMORY_R0__IMMEDIATE) &&
                op1 == Register.R0.memory && op2 instanceof Immediate) {
                return 0b0111 << 8 | op2.immediate;
            } else if (allowed.includes(Operands.MEMORY__R0) &&
                op1 instanceof Memory && op2 == Register.R0) {
                return 0b1000 << 8 | op1.memory;
            } else if (allowed.includes(Operands.MEMORY__INDIRECT_MEMORY_R0) &&
                op1 instanceof Memory && op2 == Register.R0.memory) {
                return 0b1001 << 8 | op1.memory;
            } else if (allowed.includes(Operands.IO_ADDRESS__R0) &&
                op1 instanceof IOAddress && op2 == Register.R0) {
                return 0b1100 << 8 | op1.ioAddress;
            } else if (allowed.includes(Operands.R0__IO_ADDRESS) &&
                op1 == Register.R0 && op2 instanceof IOAddress) {
                return 0b1101 << 8 | op2.ioAddress;
            } else if (allowed.includes(Operands.INDIRECT_IO__REGISTER) &&
                op1 instanceof IndirectIO && op2 instanceof Register) {
                return 0b1110 << 8 | op1.indirectIO.number << 4 | op2.number;
            } else if (allowed.includes(Operands.REGISTER__INDIRECT_IO) &&
                op1 instanceof Register && op2 instanceof IndirectIO) {
                return 0b1111 << 8 | op1.number << 4 | op2.indirectIO.number;
            } else if (allowed.includes(Operands.REGISTER__IMMEDIATE_7) &&
                op1 instanceof Register && op2 instanceof Immediate7) {
                return op1.number << 8 | op2.immediate7;
            } else if (allowed.includes(Operands.REGISTER_1234__PROG) &&
                op1 instanceof Register && op1.number >= 1 && op1.number <= 4 && op2 instanceof Prog) {
                return (op1.number - 1) << 10 | op2.prog;
            } else {
                throw new InvalidOperandsError;
            }
        }
    }

    private getOperandsAsString(): string {
        if (this.operand1 == null) {
            return ``;
        }
        else if (this.operand2 == null) {
            return ` ${this.operand1}`;
        }
        else {
            return ` ${this.operand1}, ${this.operand2}`;
        }
    }

    private getIOPrefix(): string {
        if (this.operand1?.isIO() || this.operand2?.isIO()) {
            return " io";
        }
        else {
            return "";
        }
    }
}
