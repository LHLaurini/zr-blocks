import { DJNZInstruction } from "./djnzinstruction";
import { IncDecInstruction } from "./incdecinstruction";
import { Instruction } from "./instruction";
import { JccInstruction } from "./jccinstruction";
import { JumpInstruction } from "./jumpinstruction";
import { MVSInstruction } from "./mvsinstruction";
import { Operand } from "./operand";
import { Prog } from "./prog";
import { RetxInstruction } from "./retxinstruction";
import { ShiftInstruction } from "./shiftinstruction";
import { XXXInstruction } from "./xxxinstruction";

export class Block {
    name?: string;
    instructions: Instruction[] = [];
    labels: Prog[] = [];
    references: Block[] = [];

    public get length(): number {
        return this.instructions.length;
    }

    public addRef(reference: Block) {
        this.references.push(reference);
    }

    public assemble(): Buffer {
        let buffer = Buffer.alloc(2 * this.instructions.length);

        this.instructions.forEach((instruction, index) => {
            buffer.writeUInt16BE(instruction.assemble(), 2 * index);
        });

        return buffer;
    }

    private _dependsOn(alreadyVisited: Block[], block: Block): boolean {
        if (alreadyVisited.includes(this)) {
            return false;
        } else {
            alreadyVisited.push(this);
        }

        return this.references.find((reference) => {
            if (block == reference) {
                return true;
            } else {
                return reference._dependsOn(alreadyVisited, block);
            }
        }) != undefined;
    }

    public dependsOn(block: Block) {
        return this._dependsOn([], block);
    }

    public here(label: Prog) {
        label.offset = this.instructions.length;
    }

    public label(define = true) {
        let label = Prog.label(this, define ? this.instructions.length : undefined)
        this.labels.push(label);
        return label;
    }

    public resolveLabels(offset: number) {
        this.labels.forEach((label) => label.resolve(offset));
    }

    protected jump(op: number, target: Operand): Block {
        this.instructions.push(new JumpInstruction(this, op, target));
        return this;
    }

    protected jcc(op: number, target: Operand): Block {
        this.instructions.push(new JccInstruction(this, op, target));
        return this;
    }

    protected retx(op: number): Block {
        this.instructions.push(new RetxInstruction(this, op));
        return this;
    }

    protected mvs_(dest: Operand, src: Operand): Block {
        this.instructions.push(new MVSInstruction(this, dest, src));
        return this;
    }

    protected xxx(op: number, dest: Operand, src: Operand): Block {
        this.instructions.push(new XXXInstruction(this, op, dest, src));
        return this;
    }

    protected shift(op: number, dest: Operand, src: Operand): Block {
        this.instructions.push(new ShiftInstruction(this, op, dest, src));
        return this;
    }

    protected djnz_(reg: Operand, target: Operand): Block {
        this.instructions.push(new DJNZInstruction(this, reg, target));
        return this;
    }

    protected incdec(op: number, dest: Operand): Block {
        this.instructions.push(new IncDecInstruction(this, op, dest));
        return this;
    }

    public jmp(target: Operand): Block {
        return this.jump(0b0000, target);
    }

    public jz(target: Operand): Block {
        return this.jcc(0b00, target);
    }

    public jnz(target: Operand): Block {
        return this.jcc(0b01, target);
    }

    public jc(target: Operand): Block {
        return this.jcc(0b10, target);
    }

    public jvp(target: Operand): Block {
        return this.jcc(0b11, target);
    }

    public call(target: Operand): Block {
        return this.jump(0b0010, target);
    }

    public ret(): Block {
        return this.retx(0b00);
    }

    public retc(): Block {
        return this.retx(0b01);
    }

    public rets(): Block {
        return this.retx(0b11);
    }

    public retz(): Block {
        return this.retx(0b10);
    }

    public mvs(dest: Operand, src: Operand): Block {
        return this.mvs_(dest, src);
    }

    public and(dest: Operand, src: Operand): Block {
        return this.xxx(0b0100, dest, src);
    }

    public or(dest: Operand, src: Operand): Block {
        return this.xxx(0b0101, dest, src);
    }

    public xor(dest: Operand, src: Operand): Block {
        return this.xxx(0b0110, dest, src);
    }

    public cmp(dest: Operand, src: Operand): Block {
        return this.xxx(0b0111, dest, src);
    }

    public add(dest: Operand, src: Operand): Block {
        return this.xxx(0b1000, dest, src);
    }

    public sub(dest: Operand, src: Operand): Block {
        return this.xxx(0b1001, dest, src);
    }

    public rot(dest: Operand, src: Operand): Block {
        return this.shift(0b1010, dest, src);
    }

    public shl(dest: Operand, src: Operand): Block {
        return this.shift(0b1011, dest, src);
    }

    public sha(dest: Operand, src: Operand): Block {
        return this.shift(0b1100, dest, src);
    }

    public mov(dest: Operand, src: Operand): Block {
        return this.xxx(0b1101, dest, src);
    }

    public djnz(reg: Operand, target: Operand): Block {
        return this.djnz_(reg, target);
    }

    public inc(dest: Operand): Block {
        return this.incdec(0b0, dest);
    }

    public dec(dest: Operand): Block {
        return this.incdec(0b1, dest);
    }
}
