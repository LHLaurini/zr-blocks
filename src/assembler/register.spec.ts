
import expect from 'expect';
import { Register } from './register';

function test(reg: Register, n: number) {
    expect(reg.number).toStrictEqual(n);
}

describe('Register', () => {
    it('R0', () => {
        test(Register.R0, 0);
    });
    it('R1', () => {
        test(Register.R1, 1);
    });
    it('R2', () => {
        test(Register.R2, 2);
    });
    it('R3', () => {
        test(Register.R3, 3);
    });
    it('R4', () => {
        test(Register.R4, 4);
    });
    it('R5', () => {
        test(Register.R5, 5);
    });
    it('R6', () => {
        test(Register.R6, 6);
    });
    it('R7', () => {
        test(Register.R7, 7);
    });
    it('R8', () => {
        test(Register.R8, 8);
    });
    it('R9', () => {
        test(Register.R9, 9);
    });
    it('R10', () => {
        test(Register.R10, 10);
    });
    it('R11', () => {
        test(Register.R11, 11);
    });
    it('R12', () => {
        test(Register.R12, 12);
    });
    it('R13', () => {
        test(Register.R13, 13);
    });
    it('R14', () => {
        test(Register.R14, 14);
    });
    it('R15', () => {
        test(Register.R15, 15);
    });
});
