import { Block } from "zr-assembler";
import { Immediate } from "zr-assembler";
import { Immediate7 } from "zr-assembler";
import { Linker } from "zr-assembler";
import { Operand } from "zr-assembler";
import { Prog } from "zr-assembler";
import { Register } from "zr-assembler";
import { pop, push } from "./stack";

// cycles = (2l-1) + (2*256-1) * (h-1) + (2h-1)
// h=8 & i=204 => cycles=3999 (~1ms)

const HIGH_FOR_1MS = 8
const LOW_FOR_1MS = 204

let delayMsBlock: Block;
let delayMsStart: Prog;

export function defineBlocks() {
    // R2:R1 - ms
    delayMsBlock = new Block();
    delayMsStart = delayMsBlock.label();
    delayMsBlock.inc(Register.R2);
    const majorLoop = delayMsBlock.label();
    delayMsBlock.mvs(Register.R4, Immediate7.from(HIGH_FOR_1MS));
    delayMsBlock.mov(Register.R0, Immediate.from(LOW_FOR_1MS));
    delayMsBlock.mov(Register.R3, Register.R0);
    const minorLoop = delayMsBlock.label();
    delayMsBlock.djnz(Register.R3, minorLoop);
    delayMsBlock.djnz(Register.R4, minorLoop);
    delayMsBlock.djnz(Register.R1, majorLoop);
    delayMsBlock.djnz(Register.R2, majorLoop);
    delayMsBlock.ret();
}

export function delayMs(block: Block, ms: () => Operand[]) {
    const ms_ = ms();
    block.mov(Register.R0, ms_[1] ?? Immediate.from(0)); // ms_[1] can't be R0
    push(block, Register.R0);
    block.mov(Register.R0, ms_[0]);
    block.mov(Register.R1, Register.R0);
    pop(block, Register.R2);
    block.call(delayMsStart);
}

export function addBlocks(linker: Linker) {
    linker.add(delayMsBlock);
}
