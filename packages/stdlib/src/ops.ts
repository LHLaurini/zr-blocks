import { Block } from "zr-assembler";
import { Immediate } from "zr-assembler";
import { Immediate7 } from "zr-assembler";
import { Linker } from "zr-assembler";
import { Operand } from "zr-assembler";
import { Register } from "zr-assembler";
import { Action, ActionResultType } from "./action";

export const TRUE = [Immediate.from(1)];
export const FALSE = [Immediate.from(0)];

// TODO: Maybe make these into blocks

export function defineBlocks() {
}

function enableCarry(block: Block) {
    block.mov(Register.R0, Immediate.from(0b00000100));
    block.or(Register.R15, Register.R0);
    // Clear carry/borrow
    block.shl(Register.R0, Register.R0);
}

function disableCarry(block: Block) {
    block.mov(Register.R0, Immediate.from(0b11111011));
    block.and(Register.R15, Register.R0);
}

export function neg(block: Block, a: Action): Action {
    const aVal = a.do();
    const length = a.resultSize;

    if (a.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            let carry: number = 0;
            // +1 makes sure we don't lose any extra carry
            return [...Array(length + 1)].map((_, i) => {
                let r = ((-_aVal[i]?.immediate) ?? 0) + carry;
                carry = (r & 0b100000000) ? 1 : 0;
                return Immediate.from(r & 0xff);
            });
        }, ActionResultType.IMMEDIATE, length + 1);
    } else {
        return new Action(() => {
            let regs: Register[] = [];
            enableCarry(block);
            for (let i = 0; i < length; i++) {
                block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
                block.xor(Register.R0, Immediate.from(0xff));
                block.add(Register.R0, Immediate.from(1));
                block.mov(Register.r(i + 1), Register.R0);
                regs.push(Register.r(i + 1));
            }
            return regs;
        }, ActionResultType.REGISTERS, length);
    }
}

export function not(block: Block, a: Action): Action {
    const aVal = a.do();
    const length = a.resultSize;

    if (a.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            return [...Array(length)].map((_, i) => {
                return Immediate.from((~_aVal[i]?.immediate) & 0xff);
            });
        }, ActionResultType.IMMEDIATE, length);
    } else {
        return new Action(() => {
            let regs: Register[] = [];
            for (let i = 0; i < length; i++) {
                block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
                block.xor(Register.R0, Immediate.from(0xff));
                block.mov(Register.r(i + 1), Register.R0);
                regs.push(Register.r(i + 1));
            }
            return regs;
        }, ActionResultType.REGISTERS, length);
    }
}

export function add(block: Block, a: Action, b: Action): Action {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (a.actionResultType == ActionResultType.IMMEDIATE && b.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            const _bVal = bVal as Immediate[];
            let carry: number = 0;
            // +1 makes sure we don't lose any extra carry
            return [...Array(length + 1)].map((_, i) => {
                let r = (_aVal[i]?.immediate ?? 0) + (_bVal[i]?.immediate ?? 0) + carry;
                carry = (r & 0b100000000) ? 1 : 0;
                return Immediate.from(r & 0xff);
            });
        }, ActionResultType.IMMEDIATE, length + 1);
    } else {
        return new Action(() => {
            let regs: Register[] = [];
            enableCarry(block);
            for (let i = 0; i < length; i++) {
                block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
                block.add(Register.R0, bVal[i] ?? Immediate.from(0));
                block.mov(Register.r(i + 1), Register.R0);
                regs.push(Register.r(i + 1));
            }
            return regs;
        }, ActionResultType.REGISTERS, length);
    }
};

export function sub(block: Block, a: Action, b: Action): Action {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (a.actionResultType == ActionResultType.IMMEDIATE && b.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            const _bVal = bVal as Immediate[];
            let borrow: number = 0;
            // FIXME: We need to use a class for passing operands, so we can have default values
            return [...Array(length + 1)].map((_, i) => {
                let r = (_aVal[i]?.immediate ?? 0) - (_bVal[i]?.immediate ?? 0) - borrow;
                borrow = (r & 0b100000000) ? 1 : 0;
                return Immediate.from(r & 0xff);
            });
        }, ActionResultType.IMMEDIATE, length + 1);
    } else {
        return new Action(() => {
            let regs: Register[] = [];
            enableCarry(block);
            for (let i = 0; i < length; i++) {
                block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
                block.sub(Register.R0, bVal[i] ?? Immediate.from(0));
                block.mov(Register.r(i + 1), Register.R0);
                regs.push(Register.r(i + 1));
            }
            return regs;
        }, ActionResultType.REGISTERS, length);
    }
};

export function and(block: Block, a: Action, b: Action): Action {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (a.actionResultType == ActionResultType.IMMEDIATE && b.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            const _bVal = bVal as Immediate[];
            return [...Array(length)].map((_, i) => {
                return Immediate.from((_aVal[i]?.immediate ?? 0) & (_bVal[i]?.immediate ?? 0));
            });
        }, ActionResultType.IMMEDIATE, length);
    } else {
        return new Action(() => {
            let regs: Register[] = [];
            for (let i = 0; i < length; i++) {
                block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
                block.and(Register.R0, bVal[i] ?? Immediate.from(0));
                block.mov(Register.r(i + 1), Register.R0);
                regs.push(Register.r(i + 1));
            }
            return regs;
        }, ActionResultType.REGISTERS, length);
    }
};

export function or(block: Block, a: Action, b: Action): Action {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (a.actionResultType == ActionResultType.IMMEDIATE && b.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            const _bVal = bVal as Immediate[];
            return [...Array(length)].map((_, i) => {
                return Immediate.from((_aVal[i]?.immediate ?? 0) | (_bVal[i]?.immediate ?? 0));
            });
        }, ActionResultType.IMMEDIATE, length);
    } else {
        return new Action(() => {
            let regs: Register[] = [];
            for (let i = 0; i < length; i++) {
                block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
                block.or(Register.R0, bVal[i] ?? Immediate.from(0));
                block.mov(Register.r(i + 1), Register.R0);
                regs.push(Register.r(i + 1));
            }
            return regs;
        }, ActionResultType.REGISTERS, length);
    }
};

export function xor(block: Block, a: Action, b: Action): Action {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (a.actionResultType == ActionResultType.IMMEDIATE && b.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            const _bVal = bVal as Immediate[];
            return [...Array(length)].map((_, i) => {
                return Immediate.from((_aVal[i]?.immediate ?? 0) ^ (_bVal[i]?.immediate ?? 0));
            });
        }, ActionResultType.IMMEDIATE, length);
    } else {
        return new Action(() => {
            let regs: Register[] = [];
            for (let i = 0; i < length; i++) {
                block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
                block.xor(Register.R0, bVal[i] ?? Immediate.from(0));
                block.mov(Register.r(i + 1), Register.R0);
                regs.push(Register.r(i + 1));
            }
            return regs;
        }, ActionResultType.REGISTERS, length);
    }
};

export function eq(block: Block, a: Action, b: Action): Action {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (a.actionResultType == ActionResultType.IMMEDIATE && b.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            const _bVal = bVal as Immediate[];
            return [...Array(length)].every((_, i) => (_aVal[i]?.immediate ?? 0) == (_bVal[i]?.immediate ?? 0)) ? TRUE : FALSE;
        }, ActionResultType.IMMEDIATE, 1);
    } else {
        return new Action(() => {
            disableCarry(block);
            const isFalse = block.label(false);
            block.mvs(Register.R1, Immediate7.from(0));
            for (let i = length - 1; i >= 0; i--) {
                block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
                block.cmp(Register.R0, bVal[i] ?? Immediate.from(0));
                block.jne(isFalse);
            }
            block.mvs(Register.R1, Immediate7.from(1));
            block.here(isFalse);
            return [Register.R1];
        }, ActionResultType.REGISTERS, 1);
    }
}

export function ne(block: Block, a: Action, b: Action): Action {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (a.actionResultType == ActionResultType.IMMEDIATE && b.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            const _bVal = bVal as Immediate[];
            return [...Array(length)].every((_, i) => (_aVal[i]?.immediate ?? 0) != (_bVal[i]?.immediate ?? 0)) ? TRUE : FALSE;
        }, ActionResultType.IMMEDIATE, 1);
    } else {
        return new Action(() => {
            disableCarry(block);
            const isTrue = block.label(false);
            block.mvs(Register.R1, Immediate7.from(1));
            for (let i = length - 1; i >= 0; i--) {
                block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
                block.cmp(Register.R0, bVal[i] ?? Immediate.from(0));
                block.jne(isTrue);
            }
            block.mvs(Register.R1, Immediate7.from(0));
            block.here(isTrue);
            return [Register.R1];
        }, ActionResultType.REGISTERS, 1);
    }
}

export function lt(block: Block, a: Action, b: Action): Action {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (a.actionResultType == ActionResultType.IMMEDIATE && b.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            const _bVal = bVal as Immediate[];
            for (let i = length - 1; i >= 0; i--) {
                if ((_aVal[i]?.immediate ?? 0) < (_bVal[i]?.immediate ?? 0)) {
                    return TRUE;
                } else if ((_aVal[i]?.immediate ?? 0) > (_bVal[i]?.immediate ?? 0)) {
                    return FALSE;
                }
            }
            return FALSE;
        }, ActionResultType.IMMEDIATE, 1);
    } else {
        return new Action(() => {
            disableCarry(block);
            const notEqual = block.label(false);
            const end = block.label(false);
            for (let i = length - 1; i >= 0; i--) {
                block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
                block.cmp(Register.R0, bVal[i] ?? Immediate.from(0));
                block.jne(notEqual);
            }
            // If all are equal, keep going (carry is 0)
            block.here(notEqual);
            block.mvs(Register.R1, Immediate7.from(1));
            block.jl(end);
            block.mvs(Register.R1, Immediate7.from(0));
            block.here(end);
            return [Register.R1];
        }, ActionResultType.REGISTERS, 1);
    }
}

export function le(block: Block, a: Action, b: Action): Action {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (a.actionResultType == ActionResultType.IMMEDIATE && b.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            const _bVal = bVal as Immediate[];
            for (let i = length - 1; i >= 0; i--) {
                if ((_aVal[i]?.immediate ?? 0) < (_bVal[i]?.immediate ?? 0)) {
                    return TRUE;
                } else if ((_aVal[i]?.immediate ?? 0) > (_bVal[i]?.immediate ?? 0)) {
                    return FALSE;
                }
            }
            return TRUE;
        }, ActionResultType.IMMEDIATE, 1);
    } else {
        return new Action(() => {
            disableCarry(block);
            const notEqual = block.label(false);
            const lessOrEqual = block.label(false);
            const end = block.label(false);
            for (let i = length - 1; i >= 0; i--) {
                block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
                block.cmp(Register.R0, bVal[i] ?? Immediate.from(0));
                block.jne(notEqual);
            }
            // If all are equal, keep going, then check for equality
            block.here(notEqual);
            block.je(lessOrEqual);
            block.jl(lessOrEqual);
            block.mvs(Register.R1, Immediate7.from(0));
            block.jmp(end);
            block.here(lessOrEqual);
            block.mvs(Register.R1, Immediate7.from(1));
            block.here(end);
            return [Register.R1];
        }, ActionResultType.REGISTERS, 1);
    }
}

export function gt(block: Block, a: Action, b: Action): Action {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (a.actionResultType == ActionResultType.IMMEDIATE && b.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            const _bVal = bVal as Immediate[];
            for (let i = length - 1; i >= 0; i--) {
                if ((_aVal[i]?.immediate ?? 0) < (_bVal[i]?.immediate ?? 0)) {
                    return FALSE;
                } else if ((_aVal[i]?.immediate ?? 0) > (_bVal[i]?.immediate ?? 0)) {
                    return TRUE;
                }
            }
            return FALSE;
        }, ActionResultType.IMMEDIATE, 1);
    } else {
        return new Action(() => {
            disableCarry(block);
            const notEqual = block.label(false);
            const end = block.label(false);
            for (let i = length - 1; i >= 0; i--) {
                block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
                block.cmp(Register.R0, bVal[i] ?? Immediate.from(0));
                block.jne(notEqual);
            }
            // If all are equal, keep going, then check for equality
            block.here(notEqual);
            block.mvs(Register.R1, Immediate7.from(0));
            block.je(end);
            block.jl(end);
            block.mvs(Register.R1, Immediate7.from(1));
            block.here(end);
            return [Register.R1];
        }, ActionResultType.REGISTERS, 1);
    }
}

export function ge(block: Block, a: Action, b: Action): Action {
    const aVal = a();
    const bVal = b();
    const length = Math.max(aVal.length, bVal.length);

    if (a.actionResultType == ActionResultType.IMMEDIATE && b.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            const _bVal = bVal as Immediate[];
            for (let i = length - 1; i >= 0; i--) {
                if ((_aVal[i]?.immediate ?? 0) < (_bVal[i]?.immediate ?? 0)) {
                    return FALSE;
                } else if ((_aVal[i]?.immediate ?? 0) > (_bVal[i]?.immediate ?? 0)) {
                    return TRUE;
                }
            }
            return TRUE;
        }, ActionResultType.IMMEDIATE, 1);
    } else {
        return new Action(() => {
            disableCarry(block);
            const notEqual = block.label(false);
            const end = block.label(false);
            for (let i = length - 1; i >= 0; i--) {
                block.mov(Register.R0, aVal[i] ?? Immediate.from(0));
                block.cmp(Register.R0, bVal[i] ?? Immediate.from(0));
                block.jnz(notEqual);
            }
            // If all are equal, keep going (carry is 0)
            block.here(notEqual);
            block.mvs(Register.R1, Immediate7.from(0));
            block.jl(end);
            block.mvs(Register.R1, Immediate7.from(1));
            block.here(end);
            return [Register.R1];
        }, ActionResultType.REGISTERS, 1);
    }
}

export function not2(block: Block, a: Action): Action {
    const aVal = a();

    if (a.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            return _aVal[0].immediate ? FALSE : TRUE;
        }, ActionResultType.IMMEDIATE, 1);
    } else {
        return new Action(() => {
            let skip = block.label(false);
            block.mvs(Register.R1, Immediate7.from(0));
            block.mov(Register.R0, aVal[0]);
            block.jnz(skip);
            block.mvs(Register.R1, Immediate7.from(1));
            block.here(skip);
            return [Register.R1];
        }, ActionResultType.REGISTERS, 1);
    }
}

export function and2(block: Block, a: Action, b: Action): Action {
    const aVal = a();
    const bVal = b();

    if (a.actionResultType == ActionResultType.IMMEDIATE && b.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            const _bVal = bVal as Immediate[];
            return _aVal[0].immediate && _bVal[0].immediate ? TRUE : FALSE;
        }, ActionResultType.IMMEDIATE, 1);
    } else {
        return new Action(() => {
            block.mov(Register.R0, aVal[0]);
            block.and(Register.R0, bVal[0]);
            block.mov(Register.R1, Register.R0);
            return [Register.R1];
        }, ActionResultType.REGISTERS, 1);
    }
}

export function or2(block: Block, a: Action, b: Action): Action {
    const aVal = a();
    const bVal = b();

    if (a.actionResultType == ActionResultType.IMMEDIATE && b.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            const _bVal = bVal as Immediate[];
            return _aVal[0].immediate || _bVal[0].immediate ? TRUE : FALSE;
        }, ActionResultType.IMMEDIATE, 1);
    } else {
        return new Action(() => {
            block.mov(Register.R0, aVal[0]);
            block.or(Register.R0, bVal[0]);
            block.mov(Register.R1, Register.R0);
            return [Register.R1];
        }, ActionResultType.REGISTERS, 1);
    }
}

export function xor2(block: Block, a: Action, b: Action): Action {
    const aVal = a();
    const bVal = b();

    if (a.actionResultType == ActionResultType.IMMEDIATE && b.actionResultType == ActionResultType.IMMEDIATE) {
        return new Action(() => {
            const _aVal = aVal as Immediate[];
            const _bVal = bVal as Immediate[];
            return _aVal[0].immediate != _bVal[0].immediate ? TRUE : FALSE;
        }, ActionResultType.IMMEDIATE, 1);
    } else {
        return new Action(() => {
            block.mov(Register.R0, aVal[0]);
            block.xor(Register.R0, bVal[0]);
            block.mov(Register.R1, Register.R0);
            return [Register.R1];
        }, ActionResultType.REGISTERS, 1);
    }
}

export function addBlocks(linker: Linker) {
}
