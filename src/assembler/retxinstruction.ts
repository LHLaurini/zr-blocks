import { Block } from "./block";
import { Instruction } from "./instruction";

abstract class RetxInstruction extends Instruction {
    private op: number;

    constructor(block: Block, op: number) {
        super(block);
        this.op = op;
    }

    assemble(): number {
        return 0b001100001 << 7 | this.op;
    }
}

export class RetInstruction extends RetxInstruction {
    constructor(block: Block) {
        super(block, 0b00);
    }

    get mnemonic() {
        return "ret";
    }
}

export class RetcInstruction extends RetxInstruction {
    constructor(block: Block) {
        super(block, 0b01);
    }

    get mnemonic() {
        return "retc";
    }
}

export class RetsInstruction extends RetxInstruction {
    constructor(block: Block) {
        super(block, 0b11);
    }

    get mnemonic() {
        return "rets";
    }
}

export class RetzInstruction extends RetxInstruction {
    constructor(block: Block) {
        super(block, 0b10);
    }

    get mnemonic() {
        return "retz";
    }
}
