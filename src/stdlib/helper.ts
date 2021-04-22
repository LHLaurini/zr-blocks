import { Block } from "../assembler/block";
import { Immediate } from "../assembler/immediate";
import { Immediate7 } from "../assembler/immediate7";
import { Linker } from "../assembler/linker";
import { Operand } from "../assembler/operand";
import { Prog } from "../assembler/prog";
import { Register } from "../assembler/register";
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
    block.mov(Register.R0, shift()[0]);
    push(block, Register.R0);
    block.mov(Register.R0, value()[0]);
    block.mov(Register.R1, Register.R0);
    pop(block, Register.R2);
    block.call(shiftLeftStart);
    return [Register.R1];
}

export function addBlocks(linker: Linker) {
    linker.add(shiftLeftBlock);
}
