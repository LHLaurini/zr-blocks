import { OutOfRangeError } from "./error";
import { DoubleIndirectProg } from "./doubleindirectprog";
import { Operand } from "./operand";
import { Register } from "./register";

export class IndirectMemory extends Operand {
    public readonly indirectMemory: Register;
    public readonly prog0: DoubleIndirectProg;
    public readonly prog1: DoubleIndirectProg;
    public readonly prog2: DoubleIndirectProg;
    public readonly prog3: DoubleIndirectProg;

    public prog(pair: 0 | 1 | 2 | 3) {
        switch (pair) {
            case 0:
                return this.prog0;
            case 1:
                return this.prog1;
            case 2:
                return this.prog2;
            case 3:
                return this.prog3;
            default:
                throw new OutOfRangeError;
        }
    }

    toString() {
        return `[${this.indirectMemory}]`;
    }

    private constructor(register: Register) {
        super();
        this.indirectMemory = register;
        this.prog0 = DoubleIndirectProg._def(0, this);
        this.prog1 = DoubleIndirectProg._def(1, this);
        this.prog2 = DoubleIndirectProg._def(2, this);
        this.prog3 = DoubleIndirectProg._def(3, this);
    }

    public static _def(register: Register) {
        return new IndirectMemory(register);
    }
}
