
import {ExpressManager} from "../express/expressManager";
export class ControllerManager
{
    private _expressManager:ExpressManager;
    constructor() {
        this._expressManager = new ExpressManager();
        this._expressManager.start();

    }

}