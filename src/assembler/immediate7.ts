import { NotANumberError, OutOfRangeError } from "../common/error";
import { Operand } from "./operand";

export class Immediate7 extends Operand {
    public readonly immediate7: number;

    private constructor(value: number) {
        super();
        this.immediate7 = value;
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
