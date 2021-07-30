import { App } from "./main/app";
import { protect } from "./protect";

let app: App;

protect(() => {
    app = App.instance;
});
