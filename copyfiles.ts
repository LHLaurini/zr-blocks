import copyfiles from 'copyfiles';

function callback(error?: Error) {
    if (error != undefined) {
        console.error(error);
    }
}

export function copy(...args: string[]) {
    copyfiles(Array.from(args), { error: true, up: 1, verbose: true }, callback);
}

export function copyFile(...args: string[]) {
    copyfiles(Array.from(args), { error: true, up: true, verbose: true }, callback);
}
