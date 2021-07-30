import packager from 'electron-packager';
import lzma from 'lzma-native';
import fs from 'fs';
import path from 'path';
import tar from 'tar';

packager({
    arch: ['x64', 'armv7l', 'arm64'],
    dir: '.',
    name: 'zr-blocks',
    out: 'electron-packages',
    overwrite: true,
    platform: ['win32', 'linux'],
}).then(async packages => {
    for (let pkg of packages) {
        console.log(`Compressing ${pkg}...`);
        const compressor = lzma.createCompressor({ threads: 0 });
        const output = fs.createWriteStream(`${pkg}.tar.xz`);
        await new Promise(resolve =>
            tar.c({
                C: 'electron-packages'
            }, [
                path.basename(pkg)
            ]).
                pipe(compressor).
                pipe(output).on('finish', resolve));
    }
});
