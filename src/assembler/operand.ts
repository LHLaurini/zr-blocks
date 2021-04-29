import { Block } from "./block";

export abstract class Operand {
    public addBlockRef(userBlock: Block) { }

    abstract toString(): string;
    public isIO(): boolean {
        return false;
    }
}
