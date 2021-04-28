
// Definitions are outdated, so we define our own

interface Options {
    className?: string;
    message?: string;
    placeholder?: string;
    callback?: (value: string | false) => void;
    yesText?: string;
    noText?: string;
}

type PluginFn = (vex: Vex) => void;

interface Vex {
    registerPlugin: (pluginFn: PluginFn, name?: string) => void;
    defaultOptions: Options;
    dialog: Dialog;
}

interface Dialog {
    prompt: (options: Options) => void;
}

declare module 'vex-js' {
    const vex: Vex
    export = vex;
}
