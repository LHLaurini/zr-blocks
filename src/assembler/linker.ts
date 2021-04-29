import { OutOfSpaceError, OverlappingBlockError } from "../common/error";
import { Block } from "./block";
import { Packer } from "./packer";

export const FILL_BYTE = 0xD3; // mov R0, 0xD3 (easier to notice)
export const BINARY_LENGTH = 1024;

export class Linker {
    private blocks: { address?: number, block: Block | Uint16Array }[] = [];

    public add(block: Block | Uint16Array, address?: number) {
        this.blocks.push({ block: block, address: address });
    }

    public link(): { asm: string, binary: Buffer, mne: string } {
        let binarySpace = new Packer<Block | Uint16Array>(BINARY_LENGTH);

        let dynamicBlocks = this.blocks.filter(x => x.address == undefined);
        let fixedBlocks = this.blocks.filter(x => x.address != undefined);

        for (let block of fixedBlocks) {
            if (!binarySpace.insertAt(block.address as number, block.block)) {
                throw new OverlappingBlockError;
            }
        }

        dynamicBlocks = dynamicBlocks.filter(x => {
            if (x.block instanceof Block) {
                const dynamicBlock = x.block;
                return fixedBlocks.some(y => {
                    let fixedBlock = y.block;
                    if (fixedBlock instanceof Block) {
                        return fixedBlock.dependsOn(dynamicBlock);
                    } else {
                        return false;
                    }
                });
            } else {
                return true;
            }
        });

        if (!binarySpace.insert(...dynamicBlocks.map(x => x.block)).every(x => x)) {
            throw new OutOfSpaceError;
        }

        for (let block of binarySpace.packed) {
            if (block.item instanceof Block) {
                block.item.resolveLabels(block.start);
            }
        }

        let buffer = Buffer.alloc(2 * BINARY_LENGTH, FILL_BYTE);
        let mne = new Array<string>(BINARY_LENGTH);

        for (let block of binarySpace.packed) {
            if (block.item instanceof Block) {
                block.item.assemble().copy(buffer, 2 * block.start);
                mne.splice(block.start, block.item.length, ...block.item.getMne());
            } else {
                let i = 0;
                for (let word of block.item) {
                    buffer.writeUInt16BE(word, 2 * (block.start + i++))
                }
            }
        }

        return { asm: mne.filter(x => x.length > 0).join('\n') + '\n', binary: buffer, mne: mne.join('\n') + '\n' };
    }
}
