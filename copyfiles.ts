import copyfiles from 'copyfiles';

function callback(error?: Error) {
    if (error != undefined) {
        console.error(error);
    }
}

function copy(...args: string[]) {
    copyfiles(Array.from(args), { error: true, up: 1, verbose: true }, callback);
}

copy("src/renderer/*.css", "dist");
copy("src/renderer/*.html", "dist");
copy("src/renderer/blockly/*", "dist");
