import { Block } from "../assembler/block";
import { Operand } from "../assembler/operand";
import { Prog } from "../assembler/prog";

type Cond = () => [Operand];
type Code = () => void;

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
