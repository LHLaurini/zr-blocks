import { Immediate, Memory, Register } from "zr-assembler";

export enum ActionResultType {
    IMMEDIATE, MEMORY, REGISTERS,
}

type ResultType = (Immediate | Memory | Register)[];
type FnType = () => ResultType;

export class Action {
    private action: FnType;
    private _actionResultType: ActionResultType;
    private _resultSize: number;
    private done: boolean;

    public get actionResultType() {
        return this._actionResultType;
    }

    public get resultSize() {
        return this._resultSize;
    }

    constructor(action: FnType, result: ActionResultType, resultSize: number) {
        this.action = action;
        this._actionResultType = result;
        this._resultSize = resultSize;
        this.done = false;
    }

    public do(): ResultType {
        if (this.done) {
            throw Error("tried to do action twice");
        } else {
            this.done = true;
            return this.action();
        }
    }

    public doTwo(a: Action, b: Action, fn: (a, b)): ResultType[] | void {
        if (a.actionResultType == ActionResultType.REGISTERS && b.actionResultType == ActionResultType.REGISTERS) {
            let aResult = a.do();
            if (a.actionResultType == ActionResultType.REGISTERS && b.actionResultType == ActionResultType.REGISTERS) {

            }
        } else {
            return [a.do(), b.do()];
        }
    }
}
