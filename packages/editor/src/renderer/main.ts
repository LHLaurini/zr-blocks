import { ipcRenderer } from "electron";
import { Blocks } from "zr-blocks-generator";
import { protect } from "../protect";
import { onMenu } from "./menu";
import { promptCallback } from './dialogs';

window.addEventListener('load', () => protect(async () => {
    const blocks = Blocks.instance;
    await blocks.init();
    blocks.onChange = () => ipcRenderer.send('change');
    blocks.onPrompt = promptCallback;
    blocks.onUndoAll = () => ipcRenderer.send('undo_all');
    ipcRenderer.on('menu', (_, ...args) => onMenu(blocks, ...args));
    ipcRenderer.send('ready');
}));
