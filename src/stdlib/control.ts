import { Block } from "../assembler/block";
import { Immediate } from "../assembler/immediate";
import { Operand } from "../assembler/operand";
import { Prog } from "../assembler/prog";
import { Register } from "../assembler/register";
import { push } from "./stack";

type Cond = () => [Operand];
type Code = () => void;

interface RepeatInfo {
    endLabel: Prog;
    loopLabel: Prog;
    numBytes: number;
}

function if_(block: Block, cond: Cond, thisLabel: Prog, endLabel: Prog, code: Code) {
    block.here(thisLabel);
    const result = cond()[0];
    block.or(result, result);
    const nextLabel = block.label(false);
    block.jz(nextLabel);
    code();
    block.jmp(endLabel);
    return {
        if_: (nextCond: Cond, nextCode: Code) => { return if_(block, nextCond, nextLabel, endLabel, nextCode); },
        else_: (nextCode: Code) => { return else_(block, nextLabel, endLabel, nextCode); },
        end: () => { return end(block, nextLabel, endLabel); },
    };
}

function else_(block: Block, thisLabel: Prog, endLabel: Prog, code: Code) {
    block.here(thisLabel);
    code();
    block.jmp(endLabel);
    return {
        end: () => { return end(block, null, endLabel); },
    };
}

function end(block: Block, thisLabel: Prog | null, endLabel: Prog) {
    if (thisLabel != null) {
        block.here(thisLabel);
    }
    block.here(endLabel);
}

export function beginIf(block: Block) {
    return {
        if_: (cond: Cond, code: Code) => { return if_(block, cond, block.label(false), block.label(false), code); },
    };
}

export function beginRepeatTimes(block: Block, times: () => Operand[]): RepeatInfo {
    let timesResult = times();
    let numBytes = timesResult.length;

    for (let i = 0; i < numBytes; i++) {
        block.mov(Register.R0, timesResult[i]);
        push(block, Register.R0);
    }

    const loopLabel = block.label();
    const endLabel = block.label(false);

    block.xor(Register.R0, Register.R0);
    block.mov(Register.R1, Register.R12);

    for (let i = 0; i < numBytes; i++) {
        block.or(Register.R0, Register.R1.memory);
        if (i < numBytes - 1) {
            block.inc(Register.R1);
        }
    }

    block.jz(endLabel);

    block.mov(Register.R0, Immediate.from(1));

    const borrowLabel = block.label();
    // For some reason, DEC doesn't set the carry bit
    block.sub(Register.R1.memory, Register.R0);
    block.dec(Register.R1);
    block.jc(borrowLabel);

    return {
        loopLabel: loopLabel,
        endLabel: endLabel,
        numBytes: numBytes,
    };
}

export function endRepeatTimes(block: Block, info: RepeatInfo) {
    block.jmp(info.loopLabel);
    block.here(info.endLabel);
    block.mov(Register.R0, Immediate.from(info.numBytes));
    block.add(Register.R12, Register.R0);
}
