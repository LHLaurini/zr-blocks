import { AlreadyResolvedError, NotANumberError, OutOfRangeError, UndefinedLabelError } from "../common/error";
import { Block } from "./block";
import { Operand } from "./operand";

type _Prog = number | { block: Block, offset?: number };

export class Prog extends Operand {
    private _prog: _Prog;

    public get prog(): number {
        if (typeof this._prog != 'number') {
            throw new UndefinedLabelError;
        }
        return this._prog;
    }

    public set offset(o: number) {
        if (typeof this._prog != 'object') {
            throw new AlreadyResolvedError;
        }
        this._prog.offset = o;
    }

    protected constructor(addressOrLabel: _Prog) {
        super();
        this._prog = addressOrLabel;
    }

    toString() {
        return '0x' + ('00' + this.prog.toString(16)).substr(-3);
    }

    public addBlockRef(userBlock: Block) {
        if (typeof this._prog == 'object' && userBlock != this._prog.block) {
            userBlock.addRef(this._prog.block);
        }
    }

    public resolve(blockOffset: number) {
        if (typeof this._prog != 'object') {
            throw new AlreadyResolvedError;
        }
        if (this._prog.offset == undefined) {
            throw new UndefinedLabelError;
        }
        this._prog = blockOffset + this._prog.offset;
    }

    public static at(address: number) {
        if (typeof address != 'number' || isNaN(address)) {
            throw new NotANumberError;
        }
        if (address < 0 || address > 1023) {
            throw new OutOfRangeError;
        }
        return new Prog(address);
    }

    public static label(block: Block, offset?: number) {
        return new Prog({ block: block, offset: offset });
    }
}
