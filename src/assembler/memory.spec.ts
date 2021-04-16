
import expect from 'expect';
import { Memory } from './memory';

describe('Memory', () => {
    describe('from', () => {
        it('does not throw when in range', () => {
            expect(() => Memory.at(0)).not.toThrow();
            expect(() => Memory.at(127)).not.toThrow();
            expect(() => Memory.at(128)).not.toThrow();
            expect(() => Memory.at(255)).not.toThrow();
        });
        it('throws when above range', () => {
            expect(() => Memory.at(256)).toThrow();
            expect(() => Memory.at(Infinity)).toThrow();
        });
        it('throws when below range', () => {
            expect(() => Memory.at(-1)).toThrow();
            expect(() => Memory.at(-127)).toThrow();
            expect(() => Memory.at(-128)).toThrow();
            expect(() => Memory.at(-129)).toThrow();
            expect(() => Memory.at(-Infinity)).toThrow();
        });
    });
});
