import expect from "expect";
import { Block } from "./block";
import { EXPECTED_BLOCKS, EXPECTED_BYTES, EXPECTED_MNE, EXPECTED_RECURSIVE } from "./expected";
import { Immediate } from "./immediate";
import { Immediate7 } from "./immediate7";
import { IOAddress } from "./ioaddress";
import { Memory } from "./memory";
import { Operand } from "./operand";
import { Prog } from "./prog";
import { Register } from "./register";

type Operands1 = { arg1: Operand }[];
type Operands2 = { arg1: Operand, arg2: Operand }[];

const jumpOperands: Operands1 = [
    { arg1: Prog.at(0x000) },
    { arg1: Prog.at(0x00f) },
    { arg1: Prog.at(0x0ff) },
    { arg1: Prog.at(0x3ff) },
    { arg1: Register.R0.prog0 },
    { arg1: Register.R1.prog1 },
    { arg1: Register.R2.prog2 },
    { arg1: Register.R3.prog3 },
    { arg1: Register.R0.memory.prog0 },
    { arg1: Register.R1.memory.prog1 },
    { arg1: Register.R2.memory.prog2 },
    { arg1: Register.R3.memory.prog3 },
]

const jccOperands: Operands1 = [
    { arg1: Prog.at(0x000) },
    { arg1: Prog.at(0x00f) },
    { arg1: Prog.at(0x0ff) },
    { arg1: Prog.at(0x3ff) },
]

const mvsOperands: Operands2 = [
    { arg1: Register.R0, arg2: Immediate7.from(0x7f) },
    { arg1: Register.R1, arg2: Immediate7.from(0x7f) },
    { arg1: Register.R2, arg2: Immediate7.from(0x7f) },
    { arg1: Register.R3, arg2: Immediate7.from(0x7f) },
]

const xxxOperands: Operands2 = [
    { arg1: Register.R0, arg2: Register.R0 },
    { arg1: Register.R0, arg2: Register.R1 },
    { arg1: Register.R1, arg2: Register.R0 },
    { arg1: Register.R1, arg2: Register.R2 },
    { arg1: Register.R0, arg2: Immediate.from(0x12) },
    { arg1: Register.R0, arg2: Immediate.from(0x34) },
    { arg1: Register.R0, arg2: Immediate.from(0x56) },
    { arg1: Register.R0, arg2: Immediate.from(0x78) },
    { arg1: Register.R0, arg2: Register.R0.memory },
    { arg1: Register.R0, arg2: Register.R1.memory },
    { arg1: Register.R1, arg2: Register.R0.memory },
    { arg1: Register.R1, arg2: Register.R2.memory },
    { arg1: Register.R0.memory, arg2: Register.R0 },
    { arg1: Register.R0.memory, arg2: Register.R1 },
    { arg1: Register.R1.memory, arg2: Register.R0 },
    { arg1: Register.R1.memory, arg2: Register.R2 },
    { arg1: Register.R0.memory, arg2: Register.R0.memory },
    { arg1: Register.R0.memory, arg2: Register.R1.memory },
    { arg1: Register.R1.memory, arg2: Register.R0.memory },
    { arg1: Register.R1.memory, arg2: Register.R2.memory },
    { arg1: Register.R0, arg2: Memory.at(0x12) },
    { arg1: Register.R0, arg2: Memory.at(0x34) },
    { arg1: Register.R0, arg2: Memory.at(0x56) },
    { arg1: Register.R0, arg2: Memory.at(0x78) },
    { arg1: Register.R0.memory, arg2: Immediate.from(0x12) },
    { arg1: Register.R0.memory, arg2: Immediate.from(0x34) },
    { arg1: Register.R0.memory, arg2: Immediate.from(0x56) },
    { arg1: Register.R0.memory, arg2: Immediate.from(0x78) },
    { arg1: Memory.at(0x12), arg2: Register.R0 },
    { arg1: Memory.at(0x34), arg2: Register.R0 },
    { arg1: Memory.at(0x56), arg2: Register.R0 },
    { arg1: Memory.at(0x78), arg2: Register.R0 },
    { arg1: Memory.at(0x12), arg2: Register.R0.memory },
    { arg1: Memory.at(0x34), arg2: Register.R0.memory },
    { arg1: Memory.at(0x56), arg2: Register.R0.memory },
    { arg1: Memory.at(0x78), arg2: Register.R0.memory },
    { arg1: Register.R0.memory, arg2: Memory.at(0x12) },
    { arg1: Register.R0.memory, arg2: Memory.at(0x34) },
    { arg1: Register.R0.memory, arg2: Memory.at(0x56) },
    { arg1: Register.R0.memory, arg2: Memory.at(0x78) },
    { arg1: IOAddress.at(0x12), arg2: Register.R0 },
    { arg1: IOAddress.at(0x34), arg2: Register.R0 },
    { arg1: IOAddress.at(0x56), arg2: Register.R0 },
    { arg1: IOAddress.at(0x78), arg2: Register.R0 },
    { arg1: Register.R0, arg2: IOAddress.at(0x12) },
    { arg1: Register.R0, arg2: IOAddress.at(0x34) },
    { arg1: Register.R0, arg2: IOAddress.at(0x56) },
    { arg1: Register.R0, arg2: IOAddress.at(0x78) },
    { arg1: Register.R0.io, arg2: Register.R0 },
    { arg1: Register.R0.io, arg2: Register.R1 },
    { arg1: Register.R1.io, arg2: Register.R0 },
    { arg1: Register.R1.io, arg2: Register.R2 },
    { arg1: Register.R0, arg2: Register.R0.io },
    { arg1: Register.R0, arg2: Register.R1.io },
    { arg1: Register.R1, arg2: Register.R0.io },
    { arg1: Register.R1, arg2: Register.R2.io },
]

const shiftOperands: Operands2 = [
    { arg1: Register.R0, arg2: Register.R0 },
    { arg1: Register.R0, arg2: Register.R1 },
    { arg1: Register.R1, arg2: Register.R0 },
    { arg1: Register.R1, arg2: Register.R2 },
    { arg1: Register.R0, arg2: Register.R0.memory },
    { arg1: Register.R0, arg2: Register.R1.memory },
    { arg1: Register.R1, arg2: Register.R0.memory },
    { arg1: Register.R1, arg2: Register.R2.memory },
    { arg1: Register.R0.memory, arg2: Register.R0 },
    { arg1: Register.R0.memory, arg2: Register.R1 },
    { arg1: Register.R1.memory, arg2: Register.R0 },
    { arg1: Register.R1.memory, arg2: Register.R2 },
    { arg1: Register.R0.memory, arg2: Register.R0.memory },
    { arg1: Register.R0.memory, arg2: Register.R1.memory },
    { arg1: Register.R1.memory, arg2: Register.R0.memory },
    { arg1: Register.R1.memory, arg2: Register.R2.memory },
    { arg1: Register.R0, arg2: Memory.at(0x12) },
    { arg1: Register.R0, arg2: Memory.at(0x34) },
    { arg1: Register.R0, arg2: Memory.at(0x56) },
    { arg1: Register.R0, arg2: Memory.at(0x78) },
    { arg1: Memory.at(0x12), arg2: Register.R0 },
    { arg1: Memory.at(0x34), arg2: Register.R0 },
    { arg1: Memory.at(0x56), arg2: Register.R0 },
    { arg1: Memory.at(0x78), arg2: Register.R0 },
    { arg1: Memory.at(0x12), arg2: Register.R0.memory },
    { arg1: Memory.at(0x34), arg2: Register.R0.memory },
    { arg1: Memory.at(0x56), arg2: Register.R0.memory },
    { arg1: Memory.at(0x78), arg2: Register.R0.memory },
    { arg1: Register.R0.memory, arg2: Memory.at(0x12) },
    { arg1: Register.R0.memory, arg2: Memory.at(0x34) },
    { arg1: Register.R0.memory, arg2: Memory.at(0x56) },
    { arg1: Register.R0.memory, arg2: Memory.at(0x78) },
    { arg1: IOAddress.at(0x12), arg2: Register.R0 },
    { arg1: IOAddress.at(0x34), arg2: Register.R0 },
    { arg1: IOAddress.at(0x56), arg2: Register.R0 },
    { arg1: IOAddress.at(0x78), arg2: Register.R0 },
    { arg1: Register.R0, arg2: IOAddress.at(0x12) },
    { arg1: Register.R0, arg2: IOAddress.at(0x34) },
    { arg1: Register.R0, arg2: IOAddress.at(0x56) },
    { arg1: Register.R0, arg2: IOAddress.at(0x78) },
    { arg1: Register.R0.io, arg2: Register.R0 },
    { arg1: Register.R0.io, arg2: Register.R1 },
    { arg1: Register.R1.io, arg2: Register.R0 },
    { arg1: Register.R1.io, arg2: Register.R2 },
    { arg1: Register.R0, arg2: Register.R0.io },
    { arg1: Register.R0, arg2: Register.R1.io },
    { arg1: Register.R1, arg2: Register.R0.io },
    { arg1: Register.R1, arg2: Register.R2.io },
]

const djnzOperands: Operands2 = [
    { arg1: Register.R1, arg2: Prog.at(0x000) },
    { arg1: Register.R1, arg2: Prog.at(0x00f) },
    { arg1: Register.R1, arg2: Prog.at(0x0ff) },
    { arg1: Register.R1, arg2: Prog.at(0x3ff) },
    { arg1: Register.R2, arg2: Prog.at(0x000) },
    { arg1: Register.R2, arg2: Prog.at(0x00f) },
    { arg1: Register.R2, arg2: Prog.at(0x0ff) },
    { arg1: Register.R2, arg2: Prog.at(0x3ff) },
    { arg1: Register.R3, arg2: Prog.at(0x000) },
    { arg1: Register.R3, arg2: Prog.at(0x00f) },
    { arg1: Register.R3, arg2: Prog.at(0x0ff) },
    { arg1: Register.R3, arg2: Prog.at(0x3ff) },
    { arg1: Register.R4, arg2: Prog.at(0x000) },
    { arg1: Register.R4, arg2: Prog.at(0x00f) },
    { arg1: Register.R4, arg2: Prog.at(0x0ff) },
    { arg1: Register.R4, arg2: Prog.at(0x3ff) },
]

const incDecOperands: Operands1 = [
    { arg1: Register.R0 },
    { arg1: Register.R1 },
    { arg1: Register.R2 },
    { arg1: Register.R3 },
    { arg1: Register.R0.memory },
    { arg1: Register.R1.memory },
    { arg1: Register.R2.memory },
    { arg1: Register.R3.memory },
    { arg1: Memory.at(0x12) },
    { arg1: Memory.at(0x34) },
    { arg1: Memory.at(0x56) },
    { arg1: Memory.at(0x78) },
    { arg1: IOAddress.at(0x12) },
    { arg1: IOAddress.at(0x34) },
    { arg1: IOAddress.at(0x56) },
    { arg1: IOAddress.at(0x78) },
    { arg1: Register.R0.io },
    { arg1: Register.R1.io },
    { arg1: Register.R2.io },
    { arg1: Register.R3.io },
]

describe('Block', () => {
    it('assembles correctly', () => {
        const block = new Block;

        jumpOperands.forEach((x) => block.jmp(x.arg1));
        jccOperands.forEach((x) => block.jz(x.arg1));
        jccOperands.forEach((x) => block.jnz(x.arg1));
        jccOperands.forEach((x) => block.jc(x.arg1));
        jccOperands.forEach((x) => block.jvp(x.arg1));
        jumpOperands.forEach((x) => block.call(x.arg1));
        block.ret();
        block.retc();
        block.rets();
        block.retz();
        mvsOperands.forEach((x) => block.mvs(x.arg1, x.arg2));
        xxxOperands.forEach((x) => block.and(x.arg1, x.arg2));
        xxxOperands.forEach((x) => block.or(x.arg1, x.arg2));
        xxxOperands.forEach((x) => block.xor(x.arg1, x.arg2));
        xxxOperands.forEach((x) => block.cmp(x.arg1, x.arg2));
        xxxOperands.forEach((x) => block.add(x.arg1, x.arg2));
        xxxOperands.forEach((x) => block.sub(x.arg1, x.arg2));
        shiftOperands.forEach((x) => block.rot(x.arg1, x.arg2));
        shiftOperands.forEach((x) => block.shl(x.arg1, x.arg2));
        shiftOperands.forEach((x) => block.sha(x.arg1, x.arg2));
        xxxOperands.forEach((x) => block.mov(x.arg1, x.arg2));
        djnzOperands.forEach((x) => block.djnz(x.arg1, x.arg2));
        incDecOperands.forEach((x) => block.inc(x.arg1));
        incDecOperands.forEach((x) => block.dec(x.arg1));

        expect(block.assemble()).toStrictEqual(EXPECTED_BYTES);
        expect(block.toString()).toBe(EXPECTED_MNE);
    });

    describe('label', () => {
        let defineBlock = () => {
            const block = new Block;

            let label1 = block.label();
            block.jmp(label1);
            block.jmp(label1);
            let label2 = block.label(false);
            block.jmp(label2);
            block.here(label2);
            block.jmp(label2);

            return block;
        };

        const addresses = [0x000, 0x010, 0x100, 0x110, 0x200, 0x210, 0x300, 0x310,];

        addresses.forEach((address, i) => {
            it(`works at 0x${('00' + address.toString(16)).substr(-3)}`, () => {
                debugger;
                let block = defineBlock();
                block.resolveLabels(address);
                let actual = block.assemble();
                let expected = EXPECTED_BLOCKS[i];
                expect(actual).toStrictEqual(expected);
            });
        });

        it('is required to define labels', () => {
            const block = new Block;
            let label = block.label(false);
            block.jmp(label);
            expect(() => block.resolveLabels(0)).toThrow();
        })

        it('is required to resolve labels', () => {
            const block = new Block;
            let label = block.label();
            block.jmp(label);
            expect(() => block.assemble()).toThrow();
        })

        it('works with labels in different blocks (and is safe for recursive calls)', () => {
            const block1 = new Block;
            const block2 = new Block;
            let label1 = block1.label();
            let label2 = block2.label();
            block1.jmp(label2);
            block2.jmp(label1);
            block1.resolveLabels(0x000);
            block2.resolveLabels(0x200);
            expect(block1.assemble()).toStrictEqual(EXPECTED_RECURSIVE[0]);
            expect(block2.assemble()).toStrictEqual(EXPECTED_RECURSIVE[1]);
        })

        describe('dependency detection', () => {
            const block1 = new Block;
            let labelIn1 = block1.label();

            const block2 = new Block;
            let labelIn2 = block2.label();

            const block3 = new Block;
            let labelIn3 = block3.label();

            const block4 = new Block;
            let labelIn4 = block4.label();

            const block5 = new Block;
            let labelIn5 = block5.label();

            block1.call(labelIn2);
            block1.call(labelIn4);
            block2.call(labelIn3);
            block3.call(labelIn2);
            block4.call(labelIn3);
            block5.call(labelIn4);

            expect(block1.dependsOn(block2)).toBe(true);
            expect(block1.dependsOn(block3)).toBe(true);
            expect(block1.dependsOn(block4)).toBe(true);
            expect(block1.dependsOn(block5)).toBe(false);
            expect(block2.dependsOn(block1)).toBe(false);
            expect(block2.dependsOn(block3)).toBe(true);
            expect(block2.dependsOn(block4)).toBe(false);
            expect(block2.dependsOn(block5)).toBe(false);
            expect(block3.dependsOn(block1)).toBe(false);
            expect(block3.dependsOn(block2)).toBe(true);
            expect(block3.dependsOn(block4)).toBe(false);
            expect(block3.dependsOn(block5)).toBe(false);
            expect(block4.dependsOn(block1)).toBe(false);
            expect(block4.dependsOn(block2)).toBe(true);
            expect(block4.dependsOn(block3)).toBe(true);
            expect(block4.dependsOn(block5)).toBe(false);
            expect(block5.dependsOn(block1)).toBe(false);
            expect(block5.dependsOn(block2)).toBe(true);
            expect(block5.dependsOn(block3)).toBe(true);
            expect(block5.dependsOn(block4)).toBe(true);
        });
    })
});
