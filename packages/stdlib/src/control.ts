import { Block } from "zr-assembler";
import { Immediate } from "zr-assembler";
import { Operand } from "zr-assembler";
import { Prog } from "zr-assembler";
import { Register } from "zr-assembler";
import { push } from "./stack";

type Condition = () => [Operand];
type Code = () => void;

interface RepeatTimesInfo {
    endLabel: Prog;
    loopLabel: Prog;
    numBytes: number;
}

interface RepeatWhileInfo {
    endLabel: Prog;
    loopLabel: Prog;
}

type RepeatUntilInfo = RepeatWhileInfo;

function if_(block: Block, condition: Condition, thisLabel: Prog, endLabel: Prog, code: Code) {
    block.here(thisLabel);
    const result = condition()[0];
    block.or(result, result);
    const nextLabel = block.label(false);
    block.jz(nextLabel);
    code();
    block.jmp(endLabel);
    return {
        if_: (nextCondition: Condition, nextCode: Code) => { return if_(block, nextCondition, nextLabel, endLabel, nextCode); },
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
        if_: (condition: Condition, code: Code) => { return if_(block, condition, block.label(false), block.label(false), code); },
    };
}

export function beginRepeatTimes(block: Block, times: () => Operand[]): RepeatTimesInfo {
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

export function endRepeatTimes(block: Block, info: RepeatTimesInfo) {
    block.jmp(info.loopLabel);
    block.here(info.endLabel);
    block.mov(Register.R0, Immediate.from(info.numBytes));
    block.add(Register.R12, Register.R0);
}

export function beginRepeatWhile(block: Block, condition: Condition): RepeatWhileInfo {
    const loopLabel = block.label();
    const endLabel = block.label(false);

    let conditionResult = condition();
    block.mov(Register.R0, conditionResult[0]);
    block.jz(endLabel);

    return {
        loopLabel: loopLabel,
        endLabel: endLabel,
    };
}

export function endRepeatWhile(block: Block, info: RepeatWhileInfo) {
    block.jmp(info.loopLabel);
    block.here(info.endLabel);
}

export function beginRepeatUntil(block: Block, condition: Condition): RepeatUntilInfo {
    const loopLabel = block.label();
    const endLabel = block.label(false);

    let conditionResult = condition();
    block.mov(Register.R0, conditionResult[0]);
    block.jnz(endLabel);

    return {
        loopLabel: loopLabel,
        endLabel: endLabel,
    };
}

export function endRepeatUntil(block: Block, info: RepeatUntilInfo) {
    block.jmp(info.loopLabel);
    block.here(info.endLabel);
}
