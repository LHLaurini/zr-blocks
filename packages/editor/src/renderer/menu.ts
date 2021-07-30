
import { Blocks } from 'zr-blocks-generator';
import { MenuAction } from '../menuaction';
import { ipcRenderer } from 'electron';
import util from 'util';

function makeErrorSerializable(error: any): any {
    if (util.types.isProxy(error) && error instanceof Error) {
        let newError = new Error(error.message);
        newError.name = error.name;
        newError.stack = error.stack;
        return newError;
    } else {
        return error;
    }
}

export async function onMenu(blocks: Blocks, ...args: any[]) {
    const action: MenuAction = args[0];
    const filename: string = args[1];
    const generated: string = args[2];

    let result = null;
    let error = null;

    switch (action) {
        case MenuAction.NEW:
            blocks.newFile();
            break;

        case MenuAction.OPEN:
            try {
                await blocks.openFile(filename);
            } catch (exception) {
                error = exception.toString();
            }
            error = makeErrorSerializable(error);
            ipcRenderer.send("menu_reply", action, error);
            break;

        case MenuAction.SAVE:
        case MenuAction.SAVE_AS:
            try {
                await blocks.saveFile(filename);
            } catch (exception) {
                error = exception.toString();
            }
            error = makeErrorSerializable(error);
            ipcRenderer.send("menu_reply", action, error);
            break;

        case MenuAction.UNDO:
            blocks.undo();
            break;

        case MenuAction.REDO:
            blocks.redo();
            break;

        case MenuAction.CUT:
            blocks.cut();
            break;

        case MenuAction.COPY:
            blocks.copy();
            break;

        case MenuAction.PASTE:
            blocks.paste();
            break;

        case MenuAction.DELETE:
            blocks.delete();
            break;

        case MenuAction.ZOOM_IN:
            blocks.zoomIn();
            break;

        case MenuAction.ZOOM_OUT:
            blocks.zoomOut();
            break;

        case MenuAction.ZOOM_TO_FIT:
            blocks.zoomToFit();
            break;

        case MenuAction.GENERATE:
            try {
                result = blocks.generate();
            } catch (exception: unknown) {
                error = exception;
            }
            error = makeErrorSerializable(error);
            ipcRenderer.send("menu_reply", action, result, error);
            break;

        case MenuAction.COMPILE:
            try {
                result = blocks.compile(generated, filename);
            } catch (exception: unknown) {
                error = exception;
            }
            error = makeErrorSerializable(error);
            ipcRenderer.send("menu_reply", action, result, error);
            break;

        default:
            console.warn("MenuAction not handled!");
    }
}
