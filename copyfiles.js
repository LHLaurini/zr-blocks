
const copyfiles = require('copyfiles');

function callback(error) {
    if (error !== undefined) {
        console.error(error);
    }
}

function copy() {
    copyfiles(Array.from(arguments), { error: true, up: 1, verbose: true }, callback);
}

copy("src/renderer/*.css", "dist");
copy("src/renderer/*.html", "dist");
copy("src/renderer/blockly/*", "dist");
