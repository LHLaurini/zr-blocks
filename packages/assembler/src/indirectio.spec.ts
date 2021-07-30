
import expect from 'expect';
import { IndirectIO } from './indirectio';
import { Register } from './register';

function test(io: IndirectIO, n: number) {
    expect(io.indirectIO.number).toStrictEqual(n);
}

describe('IndirectIO', () => {
    it('R0', () => {
        test(Register.R0.io, 0);
    });
    it('R1', () => {
        test(Register.R1.io, 1);
    });
    it('R2', () => {
        test(Register.R2.io, 2);
    });
    it('R3', () => {
        test(Register.R3.io, 3);
    });
    it('R4', () => {
        test(Register.R4.io, 4);
    });
    it('R5', () => {
        test(Register.R5.io, 5);
    });
    it('R6', () => {
        test(Register.R6.io, 6);
    });
    it('R7', () => {
        test(Register.R7.io, 7);
    });
    it('R8', () => {
        test(Register.R8.io, 8);
    });
    it('R9', () => {
        test(Register.R9.io, 9);
    });
    it('R10', () => {
        test(Register.R10.io, 10);
    });
    it('R11', () => {
        test(Register.R11.io, 11);
    });
    it('R12', () => {
        test(Register.R12.io, 12);
    });
    it('R13', () => {
        test(Register.R13.io, 13);
    });
    it('R14', () => {
        test(Register.R14.io, 14);
    });
    it('R15', () => {
        test(Register.R15.io, 15);
    });
});
