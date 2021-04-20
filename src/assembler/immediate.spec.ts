
import expect from 'expect';
import { Immediate } from './immediate';

describe('Immediate', () => {
    describe('from', () => {
        it('does not throw when in range', () => {
            expect(() => Immediate.from(0)).not.toThrow();
            expect(() => Immediate.from(127)).not.toThrow();
            expect(() => Immediate.from(128)).not.toThrow();
            expect(() => Immediate.from(255)).not.toThrow();
            expect(() => Immediate.from(-1)).not.toThrow();
            expect(() => Immediate.from(-127)).not.toThrow();
            expect(() => Immediate.from(-128)).not.toThrow();
        });
        it('throws when above range', () => {
            expect(() => Immediate.from(256)).toThrow();
            expect(() => Immediate.from(Infinity)).toThrow();
        });
        it('throws when below range', () => {
            expect(() => Immediate.from(-129)).toThrow();
            expect(() => Immediate.from(-Infinity)).toThrow();
        });
        it('throws when not a number', () => {
            expect(() => Immediate.from(undefined as unknown as number)).toThrow();
            expect(() => Immediate.from(null as unknown as number)).toThrow();
            expect(() => Immediate.from(NaN)).toThrow();
            expect(() => Immediate.from({} as unknown as number)).toThrow();
            expect(() => Immediate.from([] as unknown as number)).toThrow();
            expect(() => Immediate.from("" as unknown as number)).toThrow();
            expect(() => Immediate.from("0" as unknown as number)).toThrow();
            expect(() => Immediate.from("1" as unknown as number)).toThrow();
            expect(() => Immediate.from("2" as unknown as number)).toThrow();
            expect(() => Immediate.from(true as unknown as number)).toThrow();
            expect(() => Immediate.from(false as unknown as number)).toThrow();
            expect(() => Immediate.from((() => { }) as unknown as number)).toThrow();
        });
    });
});
