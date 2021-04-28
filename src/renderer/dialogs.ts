import vex from 'vex-js';
import vex_dialog from 'vex-dialog';

vex.registerPlugin(vex_dialog);
vex.defaultOptions.className = 'vex-theme-top';

export function prompt(message: string, placeholder?: string) {
    return new Promise<string | null>((resolve) =>
        promptCallback(message, placeholder, (value) => resolve(value))
    );
}

export function promptCallback(message: string, placeholder?: string, callback?: (value: string) => any) {
    return new Promise<string | null>((resolve) =>
        vex.dialog.prompt({
            message: message,
            placeholder: placeholder,
            yesText: "OK",
            noText: "Cancelar",
            callback: (value) => {
                if (value !== false && callback != undefined) {
                    callback(value);
                }
            }
        }));
}
