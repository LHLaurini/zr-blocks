import { copy, copyFile } from '../../copyfiles';
import path from 'path';

const vexJsPath = path.dirname(path.dirname(require.resolve("vex-js")));

copy("src/renderer/*.css", "dist");
copy("src/renderer/*.html", "dist");
copyFile(path.join(vexJsPath, "css/vex.css"), "dist/renderer");
copyFile(path.join(vexJsPath, "css/vex-theme-top.css"), "dist/renderer");
