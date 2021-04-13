
import { app, BrowserWindow, ipcMain } from 'electron';
import { BlocksWindow } from './blockswindow.js';
import { appErrorHandler } from '../common/protect.js';

export class App {
    private static _instance: App | undefined;

    private blocksWindow: BlocksWindow | undefined;

    public static get instance(): App {
        if (this._instance == undefined) {
            this._instance = new App;
        }
        return this._instance;
    }

    private constructor() {
        let file = process.argv.slice(2).find((arg) => !arg.startsWith('-'));

        app.whenReady().then(() => {
            this.blocksWindow = new BlocksWindow(file);

            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length == 0) {
                    this.blocksWindow = new BlocksWindow;
                }
            })
        })

        app.on('window-all-closed', () => {
            if (process.platform != 'darwin') {
                app.quit();
            }
        })

        ipcMain.on('error', appErrorHandler);
    }

    public get windows(): BlocksWindow[] {
        if (this.blocksWindow != undefined) {
            return [this.blocksWindow];
        } else {
            return [];
        }
    }
}
