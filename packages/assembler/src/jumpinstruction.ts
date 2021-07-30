import { Block } from "./block";
import { Instruction, Operands } from "./instruction";
import { Operand } from "./operand";

const allowed = [
    Operands.PROG,
    Operands.INDIRECT_PROG,
    Operands.DOUBLE_INDIRECT_PROG,
];

abstract class JumpInstruction extends Instruction {
    private op: number;
    private target: Operand;

    constructor(block: Block, op: number, target: Operand) {
        super(block);
        this.op = op;
        this.target = target;
        this.target.addBlockRef(block);
    }

    get operand1() {
        return this.target;
    }

    assemble(): number {
        return this.op << 12 | Instruction.encodeOperands(allowed, this.target);
    }
}

export class JmpInstruction extends JumpInstruction {
    constructor(block: Block, target: Operand) {
        super(block, 0b0000, target);
    }

    get mnemonic() {
        return "jmp";
    }
}

export class CallInstruction extends JumpInstruction {
    constructor(block: Block, target: Operand) {
        super(block, 0b0010, target);
    }

    get mnemonic() {
        return "call";
    }
}
