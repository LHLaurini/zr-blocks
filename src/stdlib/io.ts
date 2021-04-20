import { Block } from "../assembler/block";
import { Immediate } from "../assembler/immediate";
import { Immediate7 } from "../assembler/immediate7";
import { IOAddress } from "../assembler/ioaddress";
import { Linker } from "../assembler/linker";
import { Prog } from "../assembler/prog";
import { Register } from "../assembler/register";

export const HIGH = true;
export const LOW = false;

export const SD0 = 0;
export const SD1 = 1;
export const SD2 = 2;
export const SD3 = 3;
export const SD4 = 4;
export const SD5 = 5;
export const SD6 = 6;
export const SD7 = 7;
export const SD8 = 8;
export const SD9 = 9;
export const SD10 = 10;
export const SD11 = 11;
export const SD12 = 12;
export const SD13 = 13;
export const SD14 = 14;
export const SD15 = 15;

let outputEnable = IOAddress.at(0x09);
let outputControl = IOAddress.at(0x0a);

let setDigitalOutputBlock: Block;
let setDigitalOutputStart: Prog;

export function defineBlocks() {
    // R0 - pin, R1 - state
    setDigitalOutputBlock = new Block();
    setDigitalOutputStart = setDigitalOutputBlock.label();
    setDigitalOutputBlock.mov(Register.R2, Register.R0);
    setDigitalOutputBlock.mov(Register.R0, Immediate.from(0b00000010));
    setDigitalOutputBlock.or(Register.R15, Register.R0);    // left shift
    setDigitalOutputBlock.mov(Register.R0, Immediate.from(1));
    setDigitalOutputBlock.or(Register.R2, Register.R2);
    let skipShift = setDigitalOutputBlock.label(false);
    setDigitalOutputBlock.jz(skipShift);
    let loop = setDigitalOutputBlock.label();
    setDigitalOutputBlock.shl(Register.R0, Register.R0);
    setDigitalOutputBlock.djnz(Register.R2, loop);
    setDigitalOutputBlock.here(skipShift);
    setDigitalOutputBlock.or(outputEnable, Register.R0);
    setDigitalOutputBlock.or(Register.R1, Register.R1);
    let turnOff = setDigitalOutputBlock.label(false);
    setDigitalOutputBlock.jz(turnOff);
    setDigitalOutputBlock.or(outputControl, Register.R0);
    setDigitalOutputBlock.ret();
    setDigitalOutputBlock.here(turnOff);
    setDigitalOutputBlock.xor(Register.R0, Immediate.from(0xff));
    setDigitalOutputBlock.and(outputControl, Register.R0);
    setDigitalOutputBlock.ret();
}

export function setDigitalOutput(block: Block, pin: number, state: boolean) {
    if (typeof state != 'boolean') {
        throw TypeError('valor deve ser booleano');
    }
    block.mov(Register.R0, Immediate.from(pin));
    block.mvs(Register.R1, Immediate7.from(state ? 1 : 0));
    block.call(setDigitalOutputStart);
};

export function addBlocks(linker: Linker) {
    linker.add(setDigitalOutputBlock);
}
