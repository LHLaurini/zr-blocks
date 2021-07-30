import { Block } from "zr-assembler";
import { Operand } from "zr-assembler";
import { Register } from "zr-assembler";

export function push(block: Block, operand: Operand) {
    block.dec(Register.R12);
    block.mov(Register.R12.memory, operand)
}

export function pop(block: Block, operand: Operand | null) {
    if (operand != null) {
        block.mov(operand, Register.R12.memory)
    }
    block.inc(Register.R12);
}
