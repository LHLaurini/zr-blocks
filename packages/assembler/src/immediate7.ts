import { NotANumberError, OutOfRangeError } from "./error";
import { Operand } from "./operand";

export class Immediate7 extends Operand {
    public readonly immediate7: number;

    private constructor(value: number) {
        super();
        this.immediate7 = value;
    }

    toString() {
        return '0x' + ('0' + this.immediate7.toString(16)).substr(-2);
    }

    isImmediate(): boolean {
        return true;
    }

    public static from(value: number) {
        if (typeof value != 'number' || isNaN(value)) {
            throw new NotANumberError;
        }
        if (value < 0 || value > 127) {
            throw new OutOfRangeError;
        }
        return new Immediate7(value & 0x7F);
    }
}
