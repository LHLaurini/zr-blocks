
import { Linker } from 'zr-assembler';
import { addBlocks as addBlocksDelay, defineBlocks as defineBlocksDelay } from './delay';
import { addBlocks as addBlocksIO, defineBlocks as defineBlocksIO } from './io';
import { addBlocks as addBlocksHelper, defineBlocks as defineBlocksHelper } from './helper';
import { addBlocks as addBlocksOps, defineBlocks as defineBlocksOps } from './ops';
import { Block } from 'zr-assembler';
import { Immediate } from 'zr-assembler';
import { Register } from 'zr-assembler';

export * from './control';
export * from './io';
export * from './delay';
export * from './ops';
export * from './variable';

export const FALSE = () => [Immediate.from(0)];
export const TRUE = () => [Immediate.from(1)];

// R0 can't be used for passing or returning values
// R0-R5 = caller-saved
// R6-R11 = calee-saved
// R12 = stack pointer (starts pointing to 0x00, grows downwards)

export function addBlocks(linker: Linker) {
    addBlocksDelay(linker);
    addBlocksIO(linker);
    addBlocksHelper(linker);
    addBlocksOps(linker);
}

export function defineBlocks() {
    defineBlocksHelper();
    defineBlocksDelay();
    defineBlocksIO();
    defineBlocksOps();
}

export function setup(_block: Block) {
    let loop = _block.label();
    _block.mov(Register.R1.memory, Register.R0);
    _block.djnz(Register.R1, loop);
}
