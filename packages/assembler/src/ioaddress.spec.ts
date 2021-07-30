
import expect from 'expect';
import { IOAddress } from './ioaddress';

describe('IOAddress', () => {
    describe('from', () => {
        it('does not throw when in range', () => {
            expect(() => IOAddress.at(0)).not.toThrow();
            expect(() => IOAddress.at(127)).not.toThrow();
            expect(() => IOAddress.at(128)).not.toThrow();
            expect(() => IOAddress.at(255)).not.toThrow();
        });
        it('throws when above range', () => {
            expect(() => IOAddress.at(256)).toThrow();
            expect(() => IOAddress.at(Infinity)).toThrow();
        });
        it('throws when below range', () => {
            expect(() => IOAddress.at(-1)).toThrow();
            expect(() => IOAddress.at(-127)).toThrow();
            expect(() => IOAddress.at(-128)).toThrow();
            expect(() => IOAddress.at(-129)).toThrow();
            expect(() => IOAddress.at(-Infinity)).toThrow();
        });
        it('throws when not a number', () => {
            expect(() => IOAddress.at(undefined as unknown as number)).toThrow();
            expect(() => IOAddress.at(null as unknown as number)).toThrow();
            expect(() => IOAddress.at(NaN)).toThrow();
            expect(() => IOAddress.at({} as unknown as number)).toThrow();
            expect(() => IOAddress.at([] as unknown as number)).toThrow();
            expect(() => IOAddress.at("" as unknown as number)).toThrow();
            expect(() => IOAddress.at("0" as unknown as number)).toThrow();
            expect(() => IOAddress.at("1" as unknown as number)).toThrow();
            expect(() => IOAddress.at("2" as unknown as number)).toThrow();
            expect(() => IOAddress.at(true as unknown as number)).toThrow();
            expect(() => IOAddress.at(false as unknown as number)).toThrow();
            expect(() => IOAddress.at((() => { }) as unknown as number)).toThrow();
        });
    });
});
