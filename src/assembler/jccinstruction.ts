import { Block } from "./block";
import { Instruction, Operands } from "./instruction";
import { Operand } from "./operand";

const allowed = [
    Operands.PROG,
];

abstract class JccInstruction extends Instruction {
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
        // Need to do and with 0x3FF because jumps set an extra bit
        return 0b0001 << 12 | this.op << 10 | Instruction.encodeOperands(allowed, this.target) & 0x3FF;
    }
}

export class JzInstruction extends JccInstruction {
    constructor(block: Block, target: Operand) {
        super(block, 0b00, target);
    }

    get mnemonic() {
        return "jz";
    }
}

export class JnzInstruction extends JccInstruction {
    constructor(block: Block, target: Operand) {
        super(block, 0b01, target);
    }

    get mnemonic() {
        return "jnz";
    }
}

export class JcInstruction extends JccInstruction {
    constructor(block: Block, target: Operand) {
        super(block, 0b10, target);
    }

    get mnemonic() {
        return "jc";
    }
}

export class JvpInstruction extends JccInstruction {
    constructor(block: Block, target: Operand) {
        super(block, 0b11, target);
    }

    get mnemonic() {
        return "jvp";
    }
}
