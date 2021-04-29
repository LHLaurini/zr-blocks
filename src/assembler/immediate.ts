import { NotANumberError, OutOfRangeError } from "../common/error";
import { Operand } from "./operand";

export class Immediate extends Operand {
    public readonly immediate: number;

    private constructor(value: number) {
        super();
        this.immediate = value;
    }

    toString() {
        return '0x' + ('0' + this.immediate.toString(16)).substr(-2);
    }

    public static from(value: number) {
        if (typeof value != 'number' || isNaN(value)) {
            throw new NotANumberError;
        }
        if (value < -128 || value > 255) {
            throw new OutOfRangeError;
        }
        return new Immediate(value & 0xFF);
    }
}
