import { NotANumberError, OutOfRangeError } from "../common/error";
import { Operand } from "./operand";

export class IOAddress extends Operand {
    public readonly ioAddress: number;

    private constructor(address: number) {
        super();
        this.ioAddress = address;
    }

    toString() {
        return `[0x${('0' + this.ioAddress.toString(16)).substr(-2)}]`;
    }

    isIO() {
        return true;
    }

    public static at(address: number) {
        if (typeof address != 'number' || isNaN(address)) {
            throw new NotANumberError;
        }
        if (address < 0 || address > 255) {
            throw new OutOfRangeError;
        }
        return new IOAddress(address);
    }
}
