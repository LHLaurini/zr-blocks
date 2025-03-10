
import { Blocks } from "zr-blocks-generator";
import child_process from "child_process";
import fs from 'fs';
import expect from "expect";

const blocks = Blocks.instance;

before(async () => {
    await blocks.init();
});

function doTest(test: string, maxCycles: number) {
    it(test, async () => {
        await blocks.openFile(`test/${test}.zrb`);
        const generated = blocks.generate();
        const binary = blocks.compile(generated, `test/${test}.zrb`).binary;
        fs.writeFileSync(`test/${test}.zrb.bin`, binary);
        expect(() => child_process.execSync(`zr16-emulator test/${test}.zrb.bin --exit-sd0 --cycle-limit ${maxCycles}`)).not.toThrow();
    });
}

describe("Control", () => {
    doTest("if", 1000);
    doTest("cond", 2000);
    doTest("cond2", 10000);
});
