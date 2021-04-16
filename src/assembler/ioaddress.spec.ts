
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
    });
});
