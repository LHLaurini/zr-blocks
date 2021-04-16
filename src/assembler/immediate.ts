import { OutOfRangeError } from "../common/error";
import { Operand } from "./operand";

export class Immediate extends Operand {
    public readonly immediate: number;

    private constructor(value: number) {
        super();
        this.immediate = value;
    }

    public static from(value: number) {
        if (value < -128 || value > 255) {
            throw new OutOfRangeError;
        }
        return new Immediate(value & 0xFF);
    }
}
