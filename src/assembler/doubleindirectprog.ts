import { OutOfRangeError } from "../common/error";
import { IndirectMemory } from "./indirectmemory";
import { Operand } from "./operand";

export class DoubleIndirectProg extends Operand {
    public readonly pair: number;
    public readonly doubleIndirectProg: IndirectMemory;

    private constructor(pair: number, memory: IndirectMemory) {
        super();
        this.pair = pair;
        this.doubleIndirectProg = memory;
    }

    public static _def(pair: number, memory: IndirectMemory) {
        if (pair < 0 || pair > 3) {
            throw new OutOfRangeError;
        }
        return new DoubleIndirectProg(pair, memory);
    }
}
