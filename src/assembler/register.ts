import { OutOfRangeError } from "../common/error";
import { IndirectIO } from "./indirectio";
import { IndirectMemory } from "./indirectmemory";
import { IndirectProg } from "./indirectprog";
import { Operand } from "./operand";

export class Register extends Operand {
    public readonly number: number;
    public readonly memory: IndirectMemory;
    public readonly io: IndirectIO;
    public readonly prog0: IndirectProg;
    public readonly prog1: IndirectProg;
    public readonly prog2: IndirectProg;
    public readonly prog3: IndirectProg;

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

    protected constructor(number: number) {
        super();
        this.number = number;
        this.memory = IndirectMemory._def(this);
        this.io = IndirectIO._def(this);
        this.prog0 = IndirectProg._def(0, this);
        this.prog1 = IndirectProg._def(1, this);
        this.prog2 = IndirectProg._def(2, this);
        this.prog3 = IndirectProg._def(3, this);
    }

    toString() {
        return `r${this.number}`;
    }

    public static r(n: number) {
        switch (n) {
            case 0: return this.R0;
            case 1: return this.R1;
            case 2: return this.R2;
            case 3: return this.R3;
            case 4: return this.R4;
            case 5: return this.R5;
            case 6: return this.R6;
            case 7: return this.R7;
            case 8: return this.R8;
            case 9: return this.R9;
            case 10: return this.R10;
            case 11: return this.R11;
            case 12: return this.R12;
            case 13: return this.R13;
            case 14: return this.R14;
            case 15: return this.R15;
            default: throw new OutOfRangeError;
        }
    }

    public static readonly R0 = new Register(0);
    public static readonly R1 = new Register(1);
    public static readonly R2 = new Register(2);
    public static readonly R3 = new Register(3);
    public static readonly R4 = new Register(4);
    public static readonly R5 = new Register(5);
    public static readonly R6 = new Register(6);
    public static readonly R7 = new Register(7);
    public static readonly R8 = new Register(8);
    public static readonly R9 = new Register(9);
    public static readonly R10 = new Register(10);
    public static readonly R11 = new Register(11);
    public static readonly R12 = new Register(12);
    public static readonly R13 = new Register(13);
    public static readonly R14 = new Register(14);
    public static readonly R15 = new Register(15);
}
