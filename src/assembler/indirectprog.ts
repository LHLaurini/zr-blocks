import { OutOfRangeError } from "../common/error";
import { Operand } from "./operand";
import { Register } from "./register";

export class IndirectProg extends Operand {
    public readonly pair: number;
    public readonly indirectProg: Register;

    private constructor(pair: number, register: Register) {
        super();
        this.pair = pair;
        this.indirectProg = register;
    }

    public static _def(pair: number, register: Register) {
        if (pair < 0 || pair > 3) {
            throw new OutOfRangeError;
        }
        return new IndirectProg(pair, register);
    }
}
