import { Block } from "../assembler/block";
import { Immediate } from "../assembler/immediate";
import { Linker } from "../assembler/linker";
import { Operand } from "../assembler/operand";
import { Prog } from "../assembler/prog";
import { Register } from "../assembler/register";
import { shiftLeft } from "./helper";
import { pop, push } from "./stack";

export function defineBlocks() {
}

export function add(block: Block, a: () => Operand[], b: () => Operand[]): Operand[] {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (aVal.every(x => x instanceof Immediate) && bVal.every(x => x instanceof Immediate)) {
        const _aVal = aVal as Immediate[];
        const _bVal = bVal as Immediate[];
        let carry: number = 0;
        // +1 makes sure we don't lose any extra carry
        return [...Array(length + 1)].map((_, i) => {
            let r = (_aVal[i]?.immediate ?? 0) + (_bVal[i]?.immediate ?? 0) + carry;
            carry = (r & 0b100000000) ? 1 : 0;
            return Immediate.from(r % 256);
        });
    } else {
        let regs: Register[] = [];
        // Clear carry
        block.cmp(Register.R0, Register.R0);
        for (let i = 0; i < length; i++) {
            block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
            block.add(Register.R0, bVal[i] ?? Immediate.from(0));
            block.mov(Register.r(i + 1), Register.R0);
            regs.push(Register.r(i + 1));
        }
        return regs;
    }
};

export function sub(block: Block, a: () => Operand[], b: () => Operand[]): Operand[] {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (aVal.every(x => x instanceof Immediate) && bVal.every(x => x instanceof Immediate)) {
        const _aVal = aVal as Immediate[];
        const _bVal = bVal as Immediate[];
        let borrow: number = 0;
        // FIXME: We need to use a class for passing operands, so we can have default values
        return [...Array(length + 1)].map((_, i) => {
            let r = (_aVal[i]?.immediate ?? 0) - (_bVal[i]?.immediate ?? 0) - borrow;
            borrow = (r & 0b100000000) ? 1 : 0;
            return Immediate.from(r % 256);
        });
    } else {
        let regs: Register[] = [];
        // Clear carry (or borrow)
        block.cmp(Register.R0, Register.R0);
        for (let i = 0; i < length; i++) {
            block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
            block.sub(Register.R0, bVal[i] ?? Immediate.from(0));
            block.mov(Register.r(i + 1), Register.R0);
            regs.push(Register.r(i + 1));
        }
        return regs;
    }
};

export function and(block: Block, a: () => Operand[], b: () => Operand[]): Operand[] {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (aVal.every(x => x instanceof Immediate) && bVal.every(x => x instanceof Immediate)) {
        const _aVal = aVal as Immediate[];
        const _bVal = bVal as Immediate[];
        return [...Array(length + 1)].map((_, i) => {
            return Immediate.from((_aVal[i]?.immediate ?? 0) & (_bVal[i]?.immediate ?? 0));
        });
    } else {
        let regs: Register[] = [];
        for (let i = 0; i < length; i++) {
            block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
            block.and(Register.R0, bVal[i] ?? Immediate.from(0));
            block.mov(Register.r(i + 1), Register.R0);
            regs.push(Register.r(i + 1));
        }
        return regs;
    }
};

export function or(block: Block, a: () => Operand[], b: () => Operand[]): Operand[] {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (aVal.every(x => x instanceof Immediate) && bVal.every(x => x instanceof Immediate)) {
        const _aVal = aVal as Immediate[];
        const _bVal = bVal as Immediate[];
        return [...Array(length + 1)].map((_, i) => {
            return Immediate.from((_aVal[i]?.immediate ?? 0) | (_bVal[i]?.immediate ?? 0));
        });
    } else {
        let regs: Register[] = [];
        for (let i = 0; i < length; i++) {
            block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
            block.or(Register.R0, bVal[i] ?? Immediate.from(0));
            block.mov(Register.r(i + 1), Register.R0);
            regs.push(Register.r(i + 1));
        }
        return regs;
    }
};

export function xor(block: Block, a: () => Operand[], b: () => Operand[]): Operand[] {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (aVal.every(x => x instanceof Immediate) && bVal.every(x => x instanceof Immediate)) {
        const _aVal = aVal as Immediate[];
        const _bVal = bVal as Immediate[];
        return [...Array(length + 1)].map((_, i) => {
            return Immediate.from((_aVal[i]?.immediate ?? 0) ^ (_bVal[i]?.immediate ?? 0));
        });
    } else {
        let regs: Register[] = [];
        for (let i = 0; i < length; i++) {
            block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
            block.xor(Register.R0, bVal[i] ?? Immediate.from(0));
            block.mov(Register.r(i + 1), Register.R0);
            regs.push(Register.r(i + 1));
        }
        return regs;
    }
};

export function addBlocks(linker: Linker) {
}
