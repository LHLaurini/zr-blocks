import { App } from "./main/app.js";
import { protect } from "./common/protect.js";

let app: App;

protect(() => {
    app = App.instance;
});
