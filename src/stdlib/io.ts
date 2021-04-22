import { Block } from "../assembler/block";
import { Immediate } from "../assembler/immediate";
import { IOAddress } from "../assembler/ioaddress";
import { Linker } from "../assembler/linker";
import { Operand } from "../assembler/operand";
import { Prog } from "../assembler/prog";
import { Register } from "../assembler/register";
import { shiftLeft } from "./helper";
import { pop, push } from "./stack";

export const LOW = () => [Immediate.from(0)];
export const HIGH = () => [Immediate.from(1)];

export const SD0 = () => [Immediate.from(0)];
export const SD1 = () => [Immediate.from(1)];
export const SD2 = () => [Immediate.from(2)];
export const SD3 = () => [Immediate.from(3)];
export const SD4 = () => [Immediate.from(4)];
export const SD5 = () => [Immediate.from(5)];
export const SD6 = () => [Immediate.from(6)];
export const SD7 = () => [Immediate.from(7)];
export const SD8 = () => [Immediate.from(8)];
export const SD9 = () => [Immediate.from(9)];
export const SD10 = () => [Immediate.from(10)];
export const SD11 = () => [Immediate.from(11)];
export const SD12 = () => [Immediate.from(12)];
export const SD13 = () => [Immediate.from(13)];
export const SD14 = () => [Immediate.from(14)];
export const SD15 = () => [Immediate.from(15)];

let inputValues = IOAddress.at(0x08);
let outputEnable = IOAddress.at(0x09);
let outputControl = IOAddress.at(0x0a);

let setDigitalOutputBlock: Block;
let setDigitalOutputStart: Prog;

let getDigitalInputBlock: Block;
let getDigitalInputStart: Prog;

export function defineBlocks() {
    {
        // R1 - pin, R2 - state
        setDigitalOutputBlock = new Block();
        setDigitalOutputStart = setDigitalOutputBlock.label();
        push(setDigitalOutputBlock, Register.R2);
        shiftLeft(setDigitalOutputBlock, () => [Immediate.from(1)], () => [Register.R1]);
        setDigitalOutputBlock.mov(Register.R0, Register.R1);
        setDigitalOutputBlock.or(outputEnable, Register.R0);
        pop(setDigitalOutputBlock, Register.R2)
        setDigitalOutputBlock.or(Register.R2, Register.R2);
        let turnOff = setDigitalOutputBlock.label(false);
        setDigitalOutputBlock.jz(turnOff);
        setDigitalOutputBlock.or(outputControl, Register.R0);
        setDigitalOutputBlock.ret();
        setDigitalOutputBlock.here(turnOff);
        setDigitalOutputBlock.xor(Register.R0, Immediate.from(0xff));
        setDigitalOutputBlock.and(outputControl, Register.R0);
        setDigitalOutputBlock.ret();
    }

    {
        // R1 - pin
        // R1 - state
        getDigitalInputBlock = new Block();
        getDigitalInputStart = getDigitalInputBlock.label();
        shiftLeft(getDigitalInputBlock, () => [Immediate.from(1)], () => [Register.R1]);
        getDigitalInputBlock.mov(Register.R0, Register.R1);
        getDigitalInputBlock.xor(Register.R0, Immediate.from(0xff));
        getDigitalInputBlock.and(outputEnable, Register.R0);
        getDigitalInputBlock.mov(Register.R0, inputValues);
        getDigitalInputBlock.and(Register.R1, Register.R0);
        getDigitalInputBlock.ret();
    }
}

export function setDigitalOutput(block: Block, pin: () => Operand[], state: () => Operand[]) {
    block.mov(Register.R0, state()[0]);
    push(block, Register.R0);
    block.mov(Register.R0, pin()[0]);
    block.mov(Register.R1, Register.R0);
    pop(block, Register.R2);
    block.call(setDigitalOutputStart);
};

export function getDigitalInput(block: Block, pin: () => Operand[]) {
    block.mov(Register.R0, pin()[0]);
    block.mov(Register.R1, Register.R0);
    block.call(getDigitalInputStart);
    return [Register.R1];
};

export function addBlocks(linker: Linker) {
    linker.add(setDigitalOutputBlock);
    linker.add(getDigitalInputBlock);
}
