
import expect from 'expect';
import { DoubleIndirectProg } from './doubleindirectprog';
import { Register } from './register';

function test(mem: DoubleIndirectProg, n: number, m: number) {
    expect(mem.doubleIndirectProg.indirectMemory.number).toStrictEqual(n);
    expect(mem.pair).toStrictEqual(m);
}

describe('DoubleIndirectProg', () => {
    it('R0', () => {
        test(Register.R0.memory.prog0, 0, 0);
        test(Register.R0.memory.prog(0), 0, 0);
        test(Register.R0.memory.prog1, 0, 1);
        test(Register.R0.memory.prog(1), 0, 1);
        test(Register.R0.memory.prog2, 0, 2);
        test(Register.R0.memory.prog(2), 0, 2);
        test(Register.R0.memory.prog3, 0, 3);
        test(Register.R0.memory.prog(3), 0, 3);
    });
    it('R1', () => {
        test(Register.R1.memory.prog0, 1, 0);
        test(Register.R1.memory.prog(0), 1, 0);
        test(Register.R1.memory.prog1, 1, 1);
        test(Register.R1.memory.prog(1), 1, 1);
        test(Register.R1.memory.prog2, 1, 2);
        test(Register.R1.memory.prog(2), 1, 2);
        test(Register.R1.memory.prog3, 1, 3);
        test(Register.R1.memory.prog(3), 1, 3);
    });
    it('R2', () => {
        test(Register.R2.memory.prog0, 2, 0);
        test(Register.R2.memory.prog(0), 2, 0);
        test(Register.R2.memory.prog1, 2, 1);
        test(Register.R2.memory.prog(1), 2, 1);
        test(Register.R2.memory.prog2, 2, 2);
        test(Register.R2.memory.prog(2), 2, 2);
        test(Register.R2.memory.prog3, 2, 3);
        test(Register.R2.memory.prog(3), 2, 3);
    });
    it('R3', () => {
        test(Register.R3.memory.prog0, 3, 0);
        test(Register.R3.memory.prog(0), 3, 0);
        test(Register.R3.memory.prog1, 3, 1);
        test(Register.R3.memory.prog(1), 3, 1);
        test(Register.R3.memory.prog2, 3, 2);
        test(Register.R3.memory.prog(2), 3, 2);
        test(Register.R3.memory.prog3, 3, 3);
        test(Register.R3.memory.prog(3), 3, 3);
    });
    it('R4', () => {
        test(Register.R4.memory.prog0, 4, 0);
        test(Register.R4.memory.prog(0), 4, 0);
        test(Register.R4.memory.prog1, 4, 1);
        test(Register.R4.memory.prog(1), 4, 1);
        test(Register.R4.memory.prog2, 4, 2);
        test(Register.R4.memory.prog(2), 4, 2);
        test(Register.R4.memory.prog3, 4, 3);
        test(Register.R4.memory.prog(3), 4, 3);
    });
    it('R5', () => {
        test(Register.R5.memory.prog0, 5, 0);
        test(Register.R5.memory.prog(0), 5, 0);
        test(Register.R5.memory.prog1, 5, 1);
        test(Register.R5.memory.prog(1), 5, 1);
        test(Register.R5.memory.prog2, 5, 2);
        test(Register.R5.memory.prog(2), 5, 2);
        test(Register.R5.memory.prog3, 5, 3);
        test(Register.R5.memory.prog(3), 5, 3);
    });
    it('R6', () => {
        test(Register.R6.memory.prog0, 6, 0);
        test(Register.R6.memory.prog(0), 6, 0);
        test(Register.R6.memory.prog1, 6, 1);
        test(Register.R6.memory.prog(1), 6, 1);
        test(Register.R6.memory.prog2, 6, 2);
        test(Register.R6.memory.prog(2), 6, 2);
        test(Register.R6.memory.prog3, 6, 3);
        test(Register.R6.memory.prog(3), 6, 3);
    });
    it('R7', () => {
        test(Register.R7.memory.prog0, 7, 0);
        test(Register.R7.memory.prog(0), 7, 0);
        test(Register.R7.memory.prog1, 7, 1);
        test(Register.R7.memory.prog(1), 7, 1);
        test(Register.R7.memory.prog2, 7, 2);
        test(Register.R7.memory.prog(2), 7, 2);
        test(Register.R7.memory.prog3, 7, 3);
        test(Register.R7.memory.prog(3), 7, 3);
    });
    it('R8', () => {
        test(Register.R8.memory.prog0, 8, 0);
        test(Register.R8.memory.prog(0), 8, 0);
        test(Register.R8.memory.prog1, 8, 1);
        test(Register.R8.memory.prog(1), 8, 1);
        test(Register.R8.memory.prog2, 8, 2);
        test(Register.R8.memory.prog(2), 8, 2);
        test(Register.R8.memory.prog3, 8, 3);
        test(Register.R8.memory.prog(3), 8, 3);
    });
    it('R9', () => {
        test(Register.R9.memory.prog0, 9, 0);
        test(Register.R9.memory.prog(0), 9, 0);
        test(Register.R9.memory.prog1, 9, 1);
        test(Register.R9.memory.prog(1), 9, 1);
        test(Register.R9.memory.prog2, 9, 2);
        test(Register.R9.memory.prog(2), 9, 2);
        test(Register.R9.memory.prog3, 9, 3);
        test(Register.R9.memory.prog(3), 9, 3);
    });
    it('R10', () => {
        test(Register.R10.memory.prog0, 10, 0);
        test(Register.R10.memory.prog(0), 10, 0);
        test(Register.R10.memory.prog1, 10, 1);
        test(Register.R10.memory.prog(1), 10, 1);
        test(Register.R10.memory.prog2, 10, 2);
        test(Register.R10.memory.prog(2), 10, 2);
        test(Register.R10.memory.prog3, 10, 3);
        test(Register.R10.memory.prog(3), 10, 3);
    });
    it('R11', () => {
        test(Register.R11.memory.prog0, 11, 0);
        test(Register.R11.memory.prog(0), 11, 0);
        test(Register.R11.memory.prog1, 11, 1);
        test(Register.R11.memory.prog(1), 11, 1);
        test(Register.R11.memory.prog2, 11, 2);
        test(Register.R11.memory.prog(2), 11, 2);
        test(Register.R11.memory.prog3, 11, 3);
        test(Register.R11.memory.prog(3), 11, 3);
    });
    it('R12', () => {
        test(Register.R12.memory.prog0, 12, 0);
        test(Register.R12.memory.prog(0), 12, 0);
        test(Register.R12.memory.prog1, 12, 1);
        test(Register.R12.memory.prog(1), 12, 1);
        test(Register.R12.memory.prog2, 12, 2);
        test(Register.R12.memory.prog(2), 12, 2);
        test(Register.R12.memory.prog3, 12, 3);
        test(Register.R12.memory.prog(3), 12, 3);
    });
    it('R13', () => {
        test(Register.R13.memory.prog0, 13, 0);
        test(Register.R13.memory.prog(0), 13, 0);
        test(Register.R13.memory.prog1, 13, 1);
        test(Register.R13.memory.prog(1), 13, 1);
        test(Register.R13.memory.prog2, 13, 2);
        test(Register.R13.memory.prog(2), 13, 2);
        test(Register.R13.memory.prog3, 13, 3);
        test(Register.R13.memory.prog(3), 13, 3);
    });
    it('R14', () => {
        test(Register.R14.memory.prog0, 14, 0);
        test(Register.R14.memory.prog(0), 14, 0);
        test(Register.R14.memory.prog1, 14, 1);
        test(Register.R14.memory.prog(1), 14, 1);
        test(Register.R14.memory.prog2, 14, 2);
        test(Register.R14.memory.prog(2), 14, 2);
        test(Register.R14.memory.prog3, 14, 3);
        test(Register.R14.memory.prog(3), 14, 3);
    });
    it('R15', () => {
        test(Register.R15.memory.prog0, 15, 0);
        test(Register.R15.memory.prog(0), 15, 0);
        test(Register.R15.memory.prog1, 15, 1);
        test(Register.R15.memory.prog(1), 15, 1);
        test(Register.R15.memory.prog2, 15, 2);
        test(Register.R15.memory.prog(2), 15, 2);
        test(Register.R15.memory.prog3, 15, 3);
        test(Register.R15.memory.prog(3), 15, 3);
    });
});
