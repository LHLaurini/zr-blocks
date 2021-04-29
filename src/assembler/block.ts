import { DJNZInstruction } from "./djnzinstruction";
import { IncInstruction, DecInstruction } from "./incdecinstruction";
import { Instruction } from "./instruction";
import { JzInstruction, JnzInstruction, JcInstruction, JvpInstruction } from "./jccinstruction";
import { JmpInstruction, CallInstruction } from "./jumpinstruction";
import { MVSInstruction } from "./mvsinstruction";
import { Operand } from "./operand";
import { Prog } from "./prog";
import { RetInstruction, RetcInstruction, RetsInstruction, RetzInstruction } from "./retxinstruction";
import { RotInstruction, ShlInstruction, ShaInstruction } from "./shiftinstruction";
import { AndInstruction, OrInstruction, XorInstruction, CmpInstruction, AddInstruction, SubInstruction, MovInstruction } from "./xxxinstruction";

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

    public jmp(target: Operand): Block {
        this.instructions.push(new JmpInstruction(this, target));
        return this;
    }

    public jz(target: Operand): Block {
        this.instructions.push(new JzInstruction(this, target));
        return this;
    }

    public jnz(target: Operand): Block {
        this.instructions.push(new JnzInstruction(this, target));
        return this;
    }

    public jc(target: Operand): Block {
        this.instructions.push(new JcInstruction(this, target));
        return this;
    }

    public jvp(target: Operand): Block {
        this.instructions.push(new JvpInstruction(this, target));
        return this;
    }

    public call(target: Operand): Block {
        this.instructions.push(new CallInstruction(this, target));
        return this;
    }

    public ret(): Block {
        this.instructions.push(new RetInstruction(this));
        return this;
    }

    public retc(): Block {
        this.instructions.push(new RetcInstruction(this));
        return this;
    }

    public rets(): Block {
        this.instructions.push(new RetsInstruction(this));
        return this;
    }

    public retz(): Block {
        this.instructions.push(new RetzInstruction(this));
        return this;
    }

    public mvs(dest: Operand, src: Operand): Block {
        this.instructions.push(new MVSInstruction(this, dest, src));
        return this;
    }

    public and(dest: Operand, src: Operand): Block {
        this.instructions.push(new AndInstruction(this, dest, src));
        return this;
    }

    public or(dest: Operand, src: Operand): Block {
        this.instructions.push(new OrInstruction(this, dest, src));
        return this;
    }

    public xor(dest: Operand, src: Operand): Block {
        this.instructions.push(new XorInstruction(this, dest, src));
        return this;
    }

    public cmp(dest: Operand, src: Operand): Block {
        this.instructions.push(new CmpInstruction(this, dest, src));
        return this;
    }

    public add(dest: Operand, src: Operand): Block {
        this.instructions.push(new AddInstruction(this, dest, src));
        return this;
    }

    public sub(dest: Operand, src: Operand): Block {
        this.instructions.push(new SubInstruction(this, dest, src));
        return this;
    }

    public rot(dest: Operand, src: Operand): Block {
        this.instructions.push(new RotInstruction(this, dest, src));
        return this;
    }

    public shl(dest: Operand, src: Operand): Block {
        this.instructions.push(new ShlInstruction(this, dest, src));
        return this;
    }

    public sha(dest: Operand, src: Operand): Block {
        this.instructions.push(new ShaInstruction(this, dest, src));
        return this;
    }

    public mov(dest: Operand, src: Operand): Block {
        this.instructions.push(new MovInstruction(this, dest, src));
        return this;
    }

    public djnz(reg: Operand, target: Operand): Block {
        this.instructions.push(new DJNZInstruction(this, reg, target));
        return this;
    }

    public inc(dest: Operand): Block {
        this.instructions.push(new IncInstruction(this, dest));
        return this;
    }

    public dec(dest: Operand): Block {
        this.instructions.push(new DecInstruction(this, dest));
        return this;
    }

    public toString(): string {
        return this.getMne().join("\n") + "\n";
    }

    public getMne(): string[] {
        let mne: string[] = [];
        this.instructions.forEach((instruction, index) => {
            mne.push(instruction.toString());
        });
        return mne;
    }
}
