import { NotANumberError, OutOfRangeError } from "../common/error";
import { Operand } from "./operand";

export class Memory extends Operand {
    public readonly memory: number;

    private constructor(address: number) {
        super();
        this.memory = address;
    }

    public static at(address: number) {
        if (typeof address != 'number' || isNaN(address)) {
            throw new NotANumberError;
        }
        if (address < 0 || address > 255) {
            throw new OutOfRangeError;
        }
        return new Memory(address);
    }
}
