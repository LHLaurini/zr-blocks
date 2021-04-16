
import expect from 'expect';
import { IndirectMemory } from './indirectmemory';
import { Register } from './register';

function test(mem: IndirectMemory, n: number) {
    expect(mem.indirectMemory.number).toStrictEqual(n);
}

describe('IndirectMemory', () => {
    it('R0', () => {
        test(Register.R0.memory, 0);
    });
    it('R1', () => {
        test(Register.R1.memory, 1);
    });
    it('R2', () => {
        test(Register.R2.memory, 2);
    });
    it('R3', () => {
        test(Register.R3.memory, 3);
    });
    it('R4', () => {
        test(Register.R4.memory, 4);
    });
    it('R5', () => {
        test(Register.R5.memory, 5);
    });
    it('R6', () => {
        test(Register.R6.memory, 6);
    });
    it('R7', () => {
        test(Register.R7.memory, 7);
    });
    it('R8', () => {
        test(Register.R8.memory, 8);
    });
    it('R9', () => {
        test(Register.R9.memory, 9);
    });
    it('R10', () => {
        test(Register.R10.memory, 10);
    });
    it('R11', () => {
        test(Register.R11.memory, 11);
    });
    it('R12', () => {
        test(Register.R12.memory, 12);
    });
    it('R13', () => {
        test(Register.R13.memory, 13);
    });
    it('R14', () => {
        test(Register.R14.memory, 14);
    });
    it('R15', () => {
        test(Register.R15.memory, 15);
    });
});
