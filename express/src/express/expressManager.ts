import express = require("express");
import EventEmitter = require("events");

const path = require("path");
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser')
let PORT: number = 9300;
import {createServer} from "http";

export class ExpressManager extends EventEmitter {
    private static UPLOAD_DIR: string = "dist/uploads";

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

        let count: number = 0;
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, ExpressManager.UPLOAD_DIR)
            },
            filename: function (req, file, cb) {
                count++;
                if (count >= 1000) {
                    count = count - 1000;
                }
                const countStr = String(1000 + count).substring(1);
                const list: string[] = file.originalname.split(".");
                const extension = list[list.length - 1]
                const date: Date = new Date();
                const year: string = String(date.getFullYear());
                const month: string = String(date.getMonth() + 1 + 100).substring(1);
                const day: string = String(date.getDate() + 100).substring(1);
                const hour: string = String(date.getHours() + 100).substring(1);
                const minute: string = String(date.getMinutes() + 100).substring(1);
                const second: string = String(date.getSeconds() + 100).substring(1);
                const name: string = year + month + day + hour + minute + second + "-" + countStr + "." + extension;

                cb(null, name)
            }
        })
        const upload = multer({storage: storage})


        app.post('/image_post', upload.single('file'), function (req: any, res: any, next: Function) {
            const header: string = req.body.message
            const filename = path.join(ExpressManager.UPLOAD_DIR, req.file.filename);
            const rename = path.join(ExpressManager.UPLOAD_DIR, header + "-" + req.file.filename);
            fs.rename(filename, rename, err => {
                if (err) throw err;
                res.json({"status": "ok"});
            });
        })
        app.post('/images_post', upload.array('files'), function (req: any, res: any, next: Function) {
            const header: string = req.body.message
            let files:any[] = req.files;
            let completeCount = 0;
            let n = files.length;
            for(let i= 0;i<n;i++)
            {
                const file:string = files[i].filename;
                const filename = path.join(ExpressManager.UPLOAD_DIR , file);
                const rename = path.join(ExpressManager.UPLOAD_DIR, header + "-" + file);
                fs.rename(filename, rename, err => {
                    if (err) throw err;
                    console.log("hoge " + i)
                    completeCount++
                    if(completeCount == n)
                    {
                        res.json({"status": "ok"});
                    }

                });
            }


            //const filenames = path.join(ExpressManager.UPLOAD_DIR, req.files);
            //console.log(filenames)
            //const rename = path.join(ExpressManager.UPLOAD_DIR, header + "-" + req.file.filename);

        })


        const httpServer = createServer(app);
        httpServer.listen(PORT, () => {
            console.log("express listening on port " + PORT + " " + new Date());
        });
    }
}