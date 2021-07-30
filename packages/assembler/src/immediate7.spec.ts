
import expect from 'expect';
import { Immediate7 } from './immediate7';

describe('Immediate7', () => {
    describe('from', () => {
        it('does not throw when in range', () => {
            expect(() => Immediate7.from(0)).not.toThrow();
            expect(() => Immediate7.from(127)).not.toThrow();
        });
        it('throws when above range', () => {
            expect(() => Immediate7.from(128)).toThrow();
            expect(() => Immediate7.from(255)).toThrow();
            expect(() => Immediate7.from(256)).toThrow();
            expect(() => Immediate7.from(Infinity)).toThrow();
        });
        it('throws when below range', () => {
            expect(() => Immediate7.from(-1)).toThrow();
            expect(() => Immediate7.from(-127)).toThrow();
            expect(() => Immediate7.from(-128)).toThrow();
            expect(() => Immediate7.from(-129)).toThrow();
            expect(() => Immediate7.from(-Infinity)).toThrow();
        });
        it('throws when not a number', () => {
            expect(() => Immediate7.from(undefined as unknown as number)).toThrow();
            expect(() => Immediate7.from(null as unknown as number)).toThrow();
            expect(() => Immediate7.from(NaN)).toThrow();
            expect(() => Immediate7.from({} as unknown as number)).toThrow();
            expect(() => Immediate7.from([] as unknown as number)).toThrow();
            expect(() => Immediate7.from("" as unknown as number)).toThrow();
            expect(() => Immediate7.from("0" as unknown as number)).toThrow();
            expect(() => Immediate7.from("1" as unknown as number)).toThrow();
            expect(() => Immediate7.from("2" as unknown as number)).toThrow();
            expect(() => Immediate7.from(true as unknown as number)).toThrow();
            expect(() => Immediate7.from(false as unknown as number)).toThrow();
            expect(() => Immediate7.from((() => { }) as unknown as number)).toThrow();
        });
    });
});
