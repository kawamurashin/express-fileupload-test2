import express = require("express");
import EventEmitter = require("events");

const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser')
let PORT: number = 9320;
import {createServer} from "http";

export class ExpressManager extends EventEmitter {
    constructor() {
        super();
    }

    public start = () => {
        const app = express();
        app.use(bodyParser.urlencoded({extended: true}))
        const allowCrossDomain = function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, access_token, Accept')
            // intercept OPTIONS method
            if ('OPTIONS' === req.method) {
                res.send(200)
            } else {
                next()
            }
        }
        app.use(allowCrossDomain);
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(express.static('dist/public'));

        app.get("/data.json", (req, res) => {
            res.json({"status": "ok"});
        });

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'dist/uploads/')
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname)
            }
        })
        const upload = multer({storage: storage})


        app.post('/image_post', upload.single('file'), function (req: any, res: any, next: Function) {
            console.log(req.body.message)
            const filename = req.file.filename
            console.log(filename)
            //const content = fs.readFileSync(req.file.path, 'utf-8');
            res.json({"status": "ok"});

        })


        const httpServer = createServer(app);
        httpServer.listen(PORT, () => {
            console.log("express listening on port " + PORT + " " + new Date());
        });
    }
}