
import expect from 'expect';
import { Prog } from './prog';

describe('Prog', () => {
    describe('from', () => {
        it('does not throw when in range', () => {
            expect(() => Prog.at(0)).not.toThrow();
            expect(() => Prog.at(127)).not.toThrow();
            expect(() => Prog.at(128)).not.toThrow();
            expect(() => Prog.at(255)).not.toThrow();
            expect(() => Prog.at(256)).not.toThrow();
            expect(() => Prog.at(1023)).not.toThrow();
        });
        it('throws when above range', () => {
            expect(() => Prog.at(1024)).toThrow();
            expect(() => Prog.at(Infinity)).toThrow();
        });
        it('throws when below range', () => {
            expect(() => Prog.at(-1)).toThrow();
            expect(() => Prog.at(-127)).toThrow();
            expect(() => Prog.at(-128)).toThrow();
            expect(() => Prog.at(-129)).toThrow();
            expect(() => Prog.at(-1023)).toThrow();
            expect(() => Prog.at(-1024)).toThrow();
            expect(() => Prog.at(-1025)).toThrow();
            expect(() => Prog.at(-Infinity)).toThrow();
        });
    });
});
