import expect from "expect";
import { Block } from "./block";
import { EXPECTED_LINKER } from "./expected";
import { Immediate } from "./immediate";
import { FILL_BYTE, Linker } from "./linker";
import { Register } from "./register";

describe('Linker', () => {
    it('can link a test program', () => {
        let procBlock = new Block;
        procBlock.name = 'procBlock';
        let proc = procBlock.label();
        procBlock.mov(Register.R0, Immediate.from(0));
        procBlock.ret();

        let mainBlock = new Block;
        mainBlock.name = 'mainBlock';
        mainBlock.call(proc);
        mainBlock.jmp(mainBlock.label());

        let interruptBlock = new Block;
        interruptBlock.name = 'interruptBlock';
        interruptBlock.ret();

        let unusedBlock = new Block;
        unusedBlock.name = 'unusedBlock';
        let unused = unusedBlock.label();
        unusedBlock.jmp(unused);

        let keyBlock = Uint16Array.from([0xffff]);

        let linker = new Linker;
        linker.add(procBlock);
        linker.add(mainBlock, 0x000);
        linker.add(interruptBlock, 0x3c0);
        linker.add(unusedBlock);
        linker.add(keyBlock, 0x3ff);

        let binary = linker.link();
        expect(binary.slice(2 * 0x000, 2 * 0x004)).toStrictEqual(EXPECTED_LINKER.start);
        expect(binary.slice(2 * 0x004, 2 * 0x3c0)).toStrictEqual(Buffer.alloc(2 * 0x3bc, FILL_BYTE));
        expect(binary.slice(2 * 0x3c0, 2 * 0x3c1)).toStrictEqual(EXPECTED_LINKER.interrupt);
        expect(binary.slice(2 * 0x3c1, 2 * 0x3ff)).toStrictEqual(Buffer.alloc(2 * 0x03e, FILL_BYTE));
        expect(binary.slice(2 * 0x3ff, 2 * 0x400)).toStrictEqual(EXPECTED_LINKER.key);
    });
});
