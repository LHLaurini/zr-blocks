import { App } from "./main/app";
import { protect } from "./common/protect";

let app: App;

protect(() => {
    app = App.instance;
});
