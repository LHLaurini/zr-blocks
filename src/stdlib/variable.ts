import { Block } from "../assembler/block";
import { Immediate } from "../assembler/immediate";
import { Memory } from "../assembler/memory";
import { Operand } from "../assembler/operand";
import { Register } from "../assembler/register";

export class MemInfo {
    private numAllocatedBytes_: number = 0;
    public get numAllocatedBytes(): number {
        return this.numAllocatedBytes_;
    }

    public allocVar(num: number): Memory[] {
        const r = [...Array(num).keys()].map((offset) => Memory.at(this.numAllocatedBytes_ + offset));
        this.numAllocatedBytes_ += num;
        return r;
    }
};

export function setVar(block: Block, variable: Memory[], value: () => Operand[]) {
    let v = value();
    let i = 0;
    for (const byte of variable) {
        block.mov(Register.R0, v[i] ?? Immediate.from(0));
        block.mov(byte, Register.R0);
        i++;
    }
}
