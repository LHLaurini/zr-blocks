import { Operand } from "./operand";
import { Register } from "./register";

export class IndirectIO extends Operand {
    public readonly indirectIO: Register;

    private constructor(register: Register) {
        super();
        this.indirectIO = register;
    }

    public static _def(indirectIO: Register) {
        return new IndirectIO(indirectIO);
    }
}
