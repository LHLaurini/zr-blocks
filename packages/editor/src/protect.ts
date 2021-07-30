import { app, dialog, ipcRenderer } from "electron";

export function appErrorHandler(_: any, error: string, fullError: string) {
    dialog.showErrorBox("Erro", error);
    console.error(fullError);
    process.exitCode = 1;
    app.quit();
}

function showError(error: string, fullError: string) {
    if (process.type == "renderer") {
        ipcRenderer.send("error", error, fullError);
    } else {
        appErrorHandler(null, error, fullError);
    }
}

function handleException(e: unknown) {
    if (e instanceof Error) {
        showError(e.message, e.stack ?? "");
    } else {
        showError("Um erro inesperado aconteceu.", String(e));
    }
}

export function protect(func: () => void | Promise<void>): void {
    try {
        let result = func();
        if (result instanceof Promise) {
            result.catch(handleException);
        }
    } catch (e: unknown) {
        handleException(e);
    }
}
