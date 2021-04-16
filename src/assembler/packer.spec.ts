import expect from "expect";
import { Packer } from "./packer";

describe('Packer', () => {
    describe('maxLength', () => {
        it('result checks out', () => {
            expect(new Packer(123).maxLength).toBe(123);
            expect(new Packer(456).maxLength).toBe(456);
            expect(new Packer(789).maxLength).toBe(789);
        });
    });
    let loose: Packer<string>;
    let tight: Packer<string>;
    let mixed: Packer<string>;
    describe('insertAt', () => {
        it('works when loosely packed', () => {
            loose = new Packer<string>(16);
            expect(loose.insertAt(2, 'test')).toBe(true);
            expect(loose.insertAt(10, 'test')).toBe(true);
            expect(loose.packed).toStrictEqual([
                { start: 2, item: 'test' },
                { start: 10, item: 'test' },
            ]);
        });
        it('works when tightly packed', () => {
            tight = new Packer<string>(16);
            expect(tight.insertAt(0, 'test')).toBe(true);
            expect(tight.insertAt(4, 'test')).toBe(true);
            expect(tight.insertAt(8, 'test')).toBe(true);
            expect(tight.insertAt(12, 'test')).toBe(true);
            expect(tight.packed).toStrictEqual([
                { start: 0, item: 'test' },
                { start: 4, item: 'test' },
                { start: 8, item: 'test' },
                { start: 12, item: 'test' },
            ]);
        });
        it('works when mixedly packed', () => {
            mixed = new Packer<string>(16);
            expect(mixed.insertAt(0, 'te')).toBe(true);
            expect(mixed.insertAt(4, 'test')).toBe(true);
            expect(mixed.insertAt(8, 'test')).toBe(true);
            expect(mixed.insertAt(14, 'st')).toBe(true);
            expect(mixed.packed).toStrictEqual([
                { start: 0, item: 'te' },
                { start: 4, item: 'test' },
                { start: 8, item: 'test' },
                { start: 14, item: 'st' },
            ]);
        });
        it('fails when overlapping', () => {
            let packer = new Packer<string>(16);
            expect(packer.insertAt(0, 'test')).toBe(true);
            expect(packer.insertAt(1, 'test')).toBe(false);
            expect(packer.insertAt(2, 'test')).toBe(false);
            expect(packer.insertAt(3, 'test')).toBe(false);
            expect(packer.insertAt(4, 'test')).toBe(true);
            expect(packer.packed).toStrictEqual([
                { start: 0, item: 'test' },
                { start: 4, item: 'test' },
            ]);
        });
        it('fails when out of bounds', () => {
            let packer = new Packer<string>(16);
            expect(packer.insertAt(-4, 'test')).toBe(false);
            expect(packer.insertAt(-3, 'test')).toBe(false);
            expect(packer.insertAt(-2, 'test')).toBe(false);
            expect(packer.insertAt(-1, 'test')).toBe(false);
            expect(packer.insertAt(13, 'test')).toBe(false);
            expect(packer.insertAt(14, 'test')).toBe(false);
            expect(packer.insertAt(15, 'test')).toBe(false);
            expect(packer.insertAt(16, 'test')).toBe(false);
            expect(packer.packed).toStrictEqual([]);
        });
    });
    describe('clone', () => {
        it('result checks out', () => {
            let packer = new Packer<string>(16);
            packer.insertAt(0, 'test');
            packer.insertAt(4, 'test');
            packer.insertAt(8, 'test');
            packer.insertAt(12, 'test');
            expect(packer.clone()).toStrictEqual(packer);
        });
    });
    describe('findFreeSpace', () => {
        it('works when empty', () => {
            expect(Array.from(new Packer(16).freeSpaces)).toStrictEqual([
                { index: 0, start: 0, length: 16 },
            ]);
        });
        it('works when loosely packed', () => {
            expect(Array.from(loose.freeSpaces)).toStrictEqual([
                { index: 0, start: 0, length: 2 },
                { index: 1, start: 6, length: 4 },
                { index: 2, start: 14, length: 2 },
            ]);
        });
        it('works when tightly packed', () => {
            expect(Array.from(tight.freeSpaces)).toStrictEqual([
            ]);
        });
        it('works when mixedly packed', () => {
            expect(Array.from(mixed.freeSpaces)).toStrictEqual([
                { index: 1, start: 2, length: 2 },
                { index: 3, start: 12, length: 2 },
            ]);
        });
    });
    describe('insert', () => {
        it('works when empty', () => {
            const packer = new Packer(16);
            expect(packer.insert('aa', 'test', 'aaa', 'aa', 'a test')).toStrictEqual([true, true, true, false, true]);
            expect(packer.packed).toStrictEqual([
                { start: 0, item: 'a test' },
                { start: 6, item: 'test' },
                { start: 10, item: 'aaa' },
                { start: 13, item: 'aa' },
            ]);
            expect(Array.from(packer.freeSpaces)).toStrictEqual([
                { index: 4, start: 15, length: 1 },
            ]);
        });
        it('works when loosely packed', () => {
            expect(loose.insert('aa', 'test', 'aaa', 'aa')).toStrictEqual([true, true, false, true]);
            expect(loose.packed).toStrictEqual([
                { start: 0, item: 'aa' },
                { start: 2, item: 'test' },
                { start: 6, item: 'test' },
                { start: 10, item: 'test' },
                { start: 14, item: 'aa' },
            ]);
            expect(Array.from(loose.freeSpaces)).toStrictEqual([]);
        });
        it('works when tightly packed', () => {
            expect(tight.insert('a', 'aa', 'aaa', 'aaaa').some(x => x)).toBe(false);
            expect(tight.packed).toStrictEqual([
                { start: 0, item: 'test' },
                { start: 4, item: 'test' },
                { start: 8, item: 'test' },
                { start: 12, item: 'test' },
            ]);
            expect(Array.from(tight.freeSpaces)).toStrictEqual([]);
        });
        it('works when mixedly packed', () => {
            expect(mixed.insert('aa', 'test', 'aaa', 'aa')).toStrictEqual([true, false, false, true]);
            expect(mixed.packed).toStrictEqual([
                { start: 0, item: 'te' },
                { start: 2, item: 'aa' },
                { start: 4, item: 'test' },
                { start: 8, item: 'test' },
                { start: 12, item: 'aa' },
                { start: 14, item: 'st' },
            ]);
            expect(Array.from(mixed.freeSpaces)).toStrictEqual([]);
        });
    });
});
