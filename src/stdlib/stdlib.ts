
import { Linker } from '../assembler/linker';
import { addBlocks as addBlocksDelay, defineBlocks as defineBlocksDelay } from './delay';
import { addBlocks as addBlocksIO, defineBlocks as defineBlocksIO } from './io';
import { addBlocks as addBlocksHelper, defineBlocks as defineBlocksHelper } from './helper';

export * from './if';
export * from './io';
export * from './delay';
export * from './variable';

// R0 can't be used for passing or returning values
// R0-R5 = caller-saved
// R6-R11 = calee-saved
// R12 = stack pointer (starts pointing to 0x00, grows downwards)

export function addBlocks(linker: Linker) {
    addBlocksDelay(linker);
    addBlocksIO(linker);
    addBlocksHelper(linker);
}

export function defineBlocks() {
    defineBlocksHelper();
    defineBlocksDelay();
    defineBlocksIO();
}
