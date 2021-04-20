import expect from "expect";
import { Block } from "../assembler/block";
import { Immediate } from "../assembler/immediate";
import { Immediate7 } from "../assembler/immediate7";
import { Linker } from "../assembler/linker";
import { Prog } from "../assembler/prog";
import { Register } from "../assembler/register";

// cycles = (2l-1) + (2*256-1) * (h-1) + (2h-1)
// h=8 & i=204 => cycles=3999 (~1ms)

const HIGH_FOR_1MS = 8
const LOW_FOR_1MS = 204

let delayMsBlock: Block;
let delayMsStart: Prog;

export function defineBlocks() {
    // R1:R0 - ms
    delayMsBlock = new Block();
    delayMsStart = delayMsBlock.label();
    delayMsBlock.mov(Register.R2, Register.R0);
    delayMsBlock.inc(Register.R1);
    const majorLoop = delayMsBlock.label();
    delayMsBlock.mvs(Register.R4, Immediate7.from(HIGH_FOR_1MS));
    delayMsBlock.mov(Register.R0, Immediate.from(LOW_FOR_1MS));
    delayMsBlock.mov(Register.R3, Register.R0);
    const minorLoop = delayMsBlock.label();
    delayMsBlock.djnz(Register.R3, minorLoop);
    delayMsBlock.djnz(Register.R4, minorLoop);
    delayMsBlock.djnz(Register.R2, majorLoop);
    delayMsBlock.djnz(Register.R1, majorLoop);
    delayMsBlock.ret();
}

export function delayMs(block: Block, ms: number) {
    block.mov(Register.R0, Immediate.from(ms >> 8));
    block.mov(Register.R1, Register.R0);
    block.mov(Register.R0, Immediate.from(ms & 0xFF));
    block.call(delayMsStart);
}

export function addBlocks(linker: Linker) {
    linker.add(delayMsBlock);
}
