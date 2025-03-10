import { Block } from "zr-assembler";
import { Immediate } from "zr-assembler";
import { Linker } from "zr-assembler";
import { Operand } from "zr-assembler";
import { Prog } from "zr-assembler";
import { Register } from "zr-assembler";
import { AssemblerError } from "zr-assembler";
import { Action, ActionResultType } from "./action";
import { pop, push } from "./stack";

let shiftLeftBlock: Block;
let shiftLeftStart: Prog;

export function defineBlocks() {
    // R1 - value, R2 - shift
    // R1 - result
    shiftLeftBlock = new Block();
    shiftLeftStart = shiftLeftBlock.label();
    shiftLeftBlock.or(Register.R2, Register.R2);
    let skipShift = shiftLeftBlock.label(false);
    shiftLeftBlock.jz(skipShift);
    shiftLeftBlock.mov(Register.R0, Immediate.from(0b00000010));
    shiftLeftBlock.or(Register.R15, Register.R0);    // left shift
    let loop = shiftLeftBlock.label();
    shiftLeftBlock.shl(Register.R1, Register.R1);
    shiftLeftBlock.djnz(Register.R2, loop);
    shiftLeftBlock.here(skipShift);
    shiftLeftBlock.ret();
}

export function shiftLeft(block: Block, value: () => Operand[], shift: () => Operand[]) {
    return new Action(() => {
        block.mov(Register.R0, shift()[0]);
        push(block, Register.R0);
        block.mov(Register.R0, value()[0]);
        block.mov(Register.R1, Register.R0);
        pop(block, Register.R2);
        block.call(shiftLeftStart);
        return [Register.R1];
    }, ActionResultType.REGISTERS, 1);
}

export function addBlocks(linker: Linker) {
    linker.add(shiftLeftBlock);
}

export function bytesToNumber(value: () => Operand[]): number {
    const arr = value();
    return arr.reduce((accum, byte, i) => {
        if (!byte.isImmediate()) {
            throw new AssemblerError("valor deve ser literal");
        }
        return accum + Number(byte.toString()) << (8 * i);
    }, 0);
}
