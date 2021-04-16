
import expect from 'expect';
import { IndirectProg } from './indirectprog';
import { Register } from './register';

function test(mem: IndirectProg, n: number, m: number) {
    expect(mem.indirectProg.number).toStrictEqual(n);
    expect(mem.pair).toStrictEqual(m);
}

describe('IndirectProg', () => {
    it('R0', () => {
        test(Register.R0.prog0, 0, 0);
        test(Register.R0.prog(0), 0, 0);
        test(Register.R0.prog1, 0, 1);
        test(Register.R0.prog(1), 0, 1);
        test(Register.R0.prog2, 0, 2);
        test(Register.R0.prog(2), 0, 2);
        test(Register.R0.prog3, 0, 3);
        test(Register.R0.prog(3), 0, 3);
    });
    it('R1', () => {
        test(Register.R1.prog0, 1, 0);
        test(Register.R1.prog(0), 1, 0);
        test(Register.R1.prog1, 1, 1);
        test(Register.R1.prog(1), 1, 1);
        test(Register.R1.prog2, 1, 2);
        test(Register.R1.prog(2), 1, 2);
        test(Register.R1.prog3, 1, 3);
        test(Register.R1.prog(3), 1, 3);
    });
    it('R2', () => {
        test(Register.R2.prog0, 2, 0);
        test(Register.R2.prog(0), 2, 0);
        test(Register.R2.prog1, 2, 1);
        test(Register.R2.prog(1), 2, 1);
        test(Register.R2.prog2, 2, 2);
        test(Register.R2.prog(2), 2, 2);
        test(Register.R2.prog3, 2, 3);
        test(Register.R2.prog(3), 2, 3);
    });
    it('R3', () => {
        test(Register.R3.prog0, 3, 0);
        test(Register.R3.prog(0), 3, 0);
        test(Register.R3.prog1, 3, 1);
        test(Register.R3.prog(1), 3, 1);
        test(Register.R3.prog2, 3, 2);
        test(Register.R3.prog(2), 3, 2);
        test(Register.R3.prog3, 3, 3);
        test(Register.R3.prog(3), 3, 3);
    });
    it('R4', () => {
        test(Register.R4.prog0, 4, 0);
        test(Register.R4.prog(0), 4, 0);
        test(Register.R4.prog1, 4, 1);
        test(Register.R4.prog(1), 4, 1);
        test(Register.R4.prog2, 4, 2);
        test(Register.R4.prog(2), 4, 2);
        test(Register.R4.prog3, 4, 3);
        test(Register.R4.prog(3), 4, 3);
    });
    it('R5', () => {
        test(Register.R5.prog0, 5, 0);
        test(Register.R5.prog(0), 5, 0);
        test(Register.R5.prog1, 5, 1);
        test(Register.R5.prog(1), 5, 1);
        test(Register.R5.prog2, 5, 2);
        test(Register.R5.prog(2), 5, 2);
        test(Register.R5.prog3, 5, 3);
        test(Register.R5.prog(3), 5, 3);
    });
    it('R6', () => {
        test(Register.R6.prog0, 6, 0);
        test(Register.R6.prog(0), 6, 0);
        test(Register.R6.prog1, 6, 1);
        test(Register.R6.prog(1), 6, 1);
        test(Register.R6.prog2, 6, 2);
        test(Register.R6.prog(2), 6, 2);
        test(Register.R6.prog3, 6, 3);
        test(Register.R6.prog(3), 6, 3);
    });
    it('R7', () => {
        test(Register.R7.prog0, 7, 0);
        test(Register.R7.prog(0), 7, 0);
        test(Register.R7.prog1, 7, 1);
        test(Register.R7.prog(1), 7, 1);
        test(Register.R7.prog2, 7, 2);
        test(Register.R7.prog(2), 7, 2);
        test(Register.R7.prog3, 7, 3);
        test(Register.R7.prog(3), 7, 3);
    });
    it('R8', () => {
        test(Register.R8.prog0, 8, 0);
        test(Register.R8.prog(0), 8, 0);
        test(Register.R8.prog1, 8, 1);
        test(Register.R8.prog(1), 8, 1);
        test(Register.R8.prog2, 8, 2);
        test(Register.R8.prog(2), 8, 2);
        test(Register.R8.prog3, 8, 3);
        test(Register.R8.prog(3), 8, 3);
    });
    it('R9', () => {
        test(Register.R9.prog0, 9, 0);
        test(Register.R9.prog(0), 9, 0);
        test(Register.R9.prog1, 9, 1);
        test(Register.R9.prog(1), 9, 1);
        test(Register.R9.prog2, 9, 2);
        test(Register.R9.prog(2), 9, 2);
        test(Register.R9.prog3, 9, 3);
        test(Register.R9.prog(3), 9, 3);
    });
    it('R10', () => {
        test(Register.R10.prog0, 10, 0);
        test(Register.R10.prog(0), 10, 0);
        test(Register.R10.prog1, 10, 1);
        test(Register.R10.prog(1), 10, 1);
        test(Register.R10.prog2, 10, 2);
        test(Register.R10.prog(2), 10, 2);
        test(Register.R10.prog3, 10, 3);
        test(Register.R10.prog(3), 10, 3);
    });
    it('R11', () => {
        test(Register.R11.prog0, 11, 0);
        test(Register.R11.prog(0), 11, 0);
        test(Register.R11.prog1, 11, 1);
        test(Register.R11.prog(1), 11, 1);
        test(Register.R11.prog2, 11, 2);
        test(Register.R11.prog(2), 11, 2);
        test(Register.R11.prog3, 11, 3);
        test(Register.R11.prog(3), 11, 3);
    });
    it('R12', () => {
        test(Register.R12.prog0, 12, 0);
        test(Register.R12.prog(0), 12, 0);
        test(Register.R12.prog1, 12, 1);
        test(Register.R12.prog(1), 12, 1);
        test(Register.R12.prog2, 12, 2);
        test(Register.R12.prog(2), 12, 2);
        test(Register.R12.prog3, 12, 3);
        test(Register.R12.prog(3), 12, 3);
    });
    it('R13', () => {
        test(Register.R13.prog0, 13, 0);
        test(Register.R13.prog(0), 13, 0);
        test(Register.R13.prog1, 13, 1);
        test(Register.R13.prog(1), 13, 1);
        test(Register.R13.prog2, 13, 2);
        test(Register.R13.prog(2), 13, 2);
        test(Register.R13.prog3, 13, 3);
        test(Register.R13.prog(3), 13, 3);
    });
    it('R14', () => {
        test(Register.R14.prog0, 14, 0);
        test(Register.R14.prog(0), 14, 0);
        test(Register.R14.prog1, 14, 1);
        test(Register.R14.prog(1), 14, 1);
        test(Register.R14.prog2, 14, 2);
        test(Register.R14.prog(2), 14, 2);
        test(Register.R14.prog3, 14, 3);
        test(Register.R14.prog(3), 14, 3);
    });
    it('R15', () => {
        test(Register.R15.prog0, 15, 0);
        test(Register.R15.prog(0), 15, 0);
        test(Register.R15.prog1, 15, 1);
        test(Register.R15.prog(1), 15, 1);
        test(Register.R15.prog2, 15, 2);
        test(Register.R15.prog(2), 15, 2);
        test(Register.R15.prog3, 15, 3);
        test(Register.R15.prog(3), 15, 3);
    });
});
