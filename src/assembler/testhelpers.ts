import expect from "expect";
import { Block } from "./block";
import { EXPECTED_BYTES } from "./expected";
import { Operand } from "./operand";

export type Operands1 = { opsStr: string, arg1: Operand }[];
export type Operands2 = { opsStr: string, arg1: Operand, arg2: Operand }[];

export function testInstruction0(name: string, instruction: (block: Block) => void, pos: number[]) {
    it(`${name}`, () => {
        const block = new Block;
        let expected = EXPECTED_BYTES.subarray(2 * pos[0], 2 * (pos[0] + 1)).toString('hex');
        pos[0]++;
        instruction(block);
        let actual = block.assemble().toString('hex');
        expect(actual).toBe(expected)
        expect(block.toString()).toBe(`${name}\n`);
    });
}

export function testInstruction1(name: string, instruction: (block: Block, arg1: Operand) => void, operands: Operands1, failOperands: Operands1, pos: number[]) {
    operands.forEach((operand) => {
        it(`"${name} ${operand.opsStr}" is correct`, () => {
            const block = new Block;
            let expected = EXPECTED_BYTES.subarray(2 * pos[0], 2 * (pos[0] + 1)).toString('hex');
            pos[0]++;
            instruction(block, operand.arg1);
            let actual = block.assemble().toString('hex');
            expect(actual).toBe(expected)
            expect(block.toString()).toBe(`${name} ${operand.opsStr}\n`);
        });
    });

    failOperands.forEach((operand) => {
        it(`"${name} ${operand.opsStr}" is invalid`, () => {
            const block = new Block;
            instruction(block, operand.arg1);
            expect(() => block.assemble()).toThrow();
        });
    });
}

export function testInstruction2(name: string, instruction: (block: Block, arg1: Operand, arg2: Operand) => void, operands: Operands2, failOperands: Operands2, pos: number[]) {
    operands.forEach((operand) => {
        it(`"${name} ${operand.opsStr}" is correct`, () => {
            const block = new Block;
            let expected = EXPECTED_BYTES.subarray(2 * pos[0], 2 * (pos[0] + 1)).toString('hex');
            pos[0]++;
            instruction(block, operand.arg1, operand.arg2);
            let actual = block.assemble().toString('hex');
            expect(actual).toBe(expected)
            expect(block.toString()).toBe(`${name} ${operand.opsStr}\n`);
        });
    });

    failOperands.forEach((operand) => {
        it(`"${name} ${operand.opsStr}" is invalid`, () => {
            const block = new Block;
            instruction(block, operand.arg1, operand.arg2);
            expect(() => block.assemble()).toThrow();
        });
    });
}
