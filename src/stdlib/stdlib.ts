
import { Linker } from '../assembler/linker';
import { addBlocks as addBlocksDelay, defineBlocks as defineBlocksDelay } from './delay';
import { addBlocks as addBlocksIO, defineBlocks as defineBlocksIO } from './io';

export * from './io';
export { delayMs } from './delay';

export function addBlocks(linker: Linker) {
    addBlocksDelay(linker);
    addBlocksIO(linker);
}

export function defineBlocks() {
    defineBlocksDelay();
    defineBlocksIO();
}
