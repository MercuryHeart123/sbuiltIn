require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_IP}:${process.env.DB_PORT}/sbuiltin`;

let port = process.env.PORT || 8080

const checkAuth = (req, res, next) => {
    if (!req.session.username) {
        res.end();
    } else {
        next();
    }
};

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(
    session({
        name: process.env.SESSION_NAME,
        resave: false,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
        store: MongoStore.create({
            mongoUrl: uri,
            ttl: 3600000 / 1000,
        }),
        cookie: {
            maxAge: 3600000,
            sameSite: true,
            httpOnly: true,
            secure: false,
        },
    })
);

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    let query = { username, password };
    const client = new MongoClient(uri);
    await client.connect();
    let user = await client.db("sbuiltin").collection("users").findOne(query);
    if (user) {
        req.session.username = user.username;
        let JSONdata = JSON.stringify({
            status: "Authorized",
            username: user.username,
        });
        client.close();
        res.status(200).end(JSONdata);
    }
    else {
        let JSONdata = JSON.stringify({
            status: "Unauthorized",
            msg: "Username or password was wrong",
        });
        client.close();
        res.status(401).end(JSONdata);
    }

});
app.get("/login", (req, res) => {
    if (req.session.username) {
        res.send({
            loggedIn: true,
            username: req.session.username,
        });
    } else {
        res.send({ loggedIn: false });
    }
});

app.post("/logout", checkAuth, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.end();
        }
        res.clearCookie(process.env.SESSION_NAME);
        res.end();
    });
});

app.post("/deletepost", checkAuth, async (req, res) => {
    const { uuid, pathDB } = req.body;
    let data = { uid: uuid };
    console.log(data);
    let path = pathDB
    console.log(path);
    console.log("Hello from deletepost");
    const client = new MongoClient(uri);
    await client.connect();
    if (path == "catalog") {
        let result = await client.db("sbuiltin").collection("catalog").findOne(data);
        // console.log(result);
        console.log("it's catalog");
        if (result) {
            let rootPath = `./catalog/all-img/${uuid}`;
            fs.rmdirSync(rootPath, { recursive: true });
            let del = await client.db("sbuiltin").collection("catalog").deleteOne(result);
            if (del) {
                console.log("Post deleted");
                let JSONdata = JSON.stringify({
                    status: "Completed",
                    msg: "Delete process completed!",
                });
                client.close();
                res.status(200).end(JSONdata);
                console.log(JSONdata);
            }
            else {
                console.log("Error");
                let JSONdata = JSON.stringify({
                    status: "Failed",
                    msg: "Error! Cannot connect to database.",
                });
                client.close();
                res.status(401).end(JSONdata);
                console.log(JSONdata);
            }
        }
    } else if (path == "model") {
        let result = await client.db("sbuiltin").collection("model").findOne(data);
        console.log(result.pathaddon);
        console.log("it's model");
        if (result && result.pathaddon !== undefined) {
            let imgPath = `./model/all-img/${uuid}`;
            let addonPath = `./model/addon/${uuid}`;
            let previewPath = `./model/preview-img/${uuid}`
            fs.rmdirSync(imgPath, { recursive: true });
            fs.rmdirSync(addonPath, { recursive: true });
            fs.rmdirSync(previewPath, { recursive: true });
            let del = await client.db("sbuiltin").collection("model").deleteOne(result);
            if (del) {
                console.log("Post deleted");
                let JSONdata = JSON.stringify({
                    status: "Completed",
                    msg: "Delete process completed!",
                });
                client.close();
                res.status(200).end(JSONdata);
                console.log(JSONdata);
            }
            else {
                console.log("Error");
                let JSONdata = JSON.stringify({
                    status: "Failed",
                    msg: "Error! Cannot connect to database.",
                });
                client.close();
                res.status(401).end(JSONdata);
                console.log(JSONdata);
            }
        } else if (result && result.pathaddon === undefined) {
            let imgPath = `./model/all-img/${uuid}`;
            let previewPath = `./model/preview-img/${uuid}`
            fs.rmdirSync(imgPath, { recursive: true });
            fs.rmdirSync(previewPath, { recursive: true });
            let del = await client.db("sbuiltin").collection("model").deleteOne(result);
            if (del) {
                console.log("Post deleted");
                let JSONdata = JSON.stringify({
                    status: "Completed",
                    msg: "Delete process completed!",
                });
                client.close();
                res.status(200).end(JSONdata);
                console.log(JSONdata);
            }
            else {
                console.log("Error");
                let JSONdata = JSON.stringify({
                    status: "Failed",
                    msg: "Error! Cannot connect to database.",
                });
                client.close();
                res.status(401).end(JSONdata);
                console.log(JSONdata);
            }
        }
    }
})

app.get("/listmodel", async (req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    let result = await client.db("sbuiltin").collection("model").find().toArray();
    res.send(result);
})

app.post("/callbase64", (req, res) => {
    const { path, model } = req.body;
    if (!path) {
        res.send();
    }
    else {
        let file = fs.readFileSync(path);
        if (model) {
            res.send(file)
        }
        else {
            res.send(file.toString("base64"));
        }
    }
});

app.post("/getmodel", async (req, res) => {
    const { uid, name } = req.body;
    let data = {
        uid: uid,
        title: name,
    };
    const client = new MongoClient(uri);
    await client.connect();
    let result = await client.db("sbuiltin").collection("model").findOne(data);
    let info = [];
    let img = result.imgforpreview;
    let uuid = result.uid;
    let title = result.title;
    let about = result.about;
    let price = result.price;
    let width = result.widthDimension;
    let date = result.dateModified;
    let img64 = fs.readFileSync(img, "base64");
    info.push(title, about, price, width, date, uuid, img64);
    res.send(info);
    console.log("Hello from get model");
})

app.get("/listcatalog", async (req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    let result = await client.db("sbuiltin").collection("catalog").find({}, { projection: { _id: 0, title: 1, about: 1, place: 1, pathimg: 1, imgforpreview: 1, dateModified: 1, uid: 1 } }).toArray();
    console.log("Hello from get listcatalog");
    res.send(result);
})

app.post("/getcatalog", async (req, res) => {
    const { uid, name } = req.body;
    let data = {
        uid: uid,
        title: name,
    };
    const client = new MongoClient(uri);
    await client.connect();
    let result = await client.db("sbuiltin").collection("catalog").findOne(data);
    // console.log(result);
    let info = [];
    let img = result.imgforpreview;
    let uuid = result.uid;
    let title = result.title;
    let about = result.about;
    let place = result.place;
    let date = result.dateModified;
    let img64 = fs.readFileSync(img, "base64");
    info.push(title, about, place, date, uuid, img64);
    // console.log(info);
    res.send(info);
    console.log("Hello from get catalog");
})

app.post("/editcatalog", checkAuth, async (req, res) => {
    const { namecat, detailcat, placecat, image, uid } = req.body;
    let query = { namecat, detailcat, placecat, image, uid };
    let today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();
    var serverDate = `Last modified: ${date}@${time}`;
    console.log(date);
    console.log("Hello from post editcatalog");
    let path = [];
    let imgUid = uuidv4();
    fs.mkdirSync(`./catalog/all-img/${query.uid}`, { recursive: true });
    let rootPath = `./catalog/all-img/${query.uid}`;
    let imgPath;
    let previewimg;
    for (let i = 0; i < query.image.length; i++) {
        imgUid = uuidv4();
        let base64Image = query.image[i].split(";base64,").pop();
        imgPath = rootPath + `/${imgUid}.jpg`;
        path.push(imgPath);
        fs.writeFile(
            imgPath,
            base64Image,
            { encoding: "base64" },
            function (err) {
                console.log(`jpg created`);
            }
        );
        if (i == 0) {
            previewimg = imgPath;
        }
    }
    // fs.mkdirSync(`./catalog/preview-img/${query.uid}`, { recursive: true });
    // rootPath = `./catalog/preview-img/${query.uid}`;
    // imgUid = uuidv4();
    // let base64Image = query.image[0].split(";base64,").pop();
    // imgPath = rootPath + `/${imgUid}.jpg`;
    // path.push(imgPath);
    // fs.writeFile(
    //     imgPath,
    //     base64Image,
    //     { encoding: "base64" },
    //     function (err) {
    //         console.log(`jpg created`);
    //     }
    // );
    var cat = {
        title: query.namecat,
        about: query.detailcat,
        place: query.placecat,
        pathimg: path,
        imgforpreview: previewimg,
        uid: query.uid,
        dateModified: serverDate
    }
    console.log(imgPath);
    const client = new MongoClient(uri);
    await client.connect();
    let info = await client.db("sbuiltin").collection("catalog").insertOne(cat);
    if (info) {
        console.log("Data inserted");
        let JSONdata = JSON.stringify({
            status: "Completed",
            msg: "Upload completed!",
        });
        client.close();
        res.status(200).end(JSONdata);
        console.log(JSONdata);
    }
    else {
        console.log("Error");
        let JSONdata = JSON.stringify({
            status: "Failed",
            msg: "Error! Cannot connect to database.",
        });
        client.close();
        res.status(401).end(JSONdata);
        console.log(JSONdata);
    }
})

app.post("/editmodel", checkAuth, async (req, res) => {
    const { namemodel, detailmodel, pricemodel, dimensionmodel, image, imagePreview, imageAddon, uid } = req.body;
    let query = { namemodel, detailmodel, pricemodel, dimensionmodel, image, imagePreview, imageAddon, uid };
    let today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();
    var serverDate = `Last modified: ${date}@${time}`;
    let priceNum = parseInt(query.pricemodel);
    let dimensionNum = parseFloat(query.dimensionmodel)
    console.log(dimensionNum);
    console.log(date);
    console.log("Hello from post editmodel");
    let imgUid;
    fs.mkdirSync(`./model/all-img/${query.uid}`, { recursive: true });
    let rootPath = `./model/all-img/${query.uid}`;
    let modelImg;
    let previewImg;
    let addon;
    var model;
    let base64Image;
    // console.log(name);
    // for (let i = 0; i < query.image.length; i++) {
    //     imgUid = uuidv4();
    //     base64Image = query.image[i].split(";base64,").pop();
    //     console.log(base64Image);
    //     modelImg = rootPath + `/${query.uid}.gltf`;
    //     fs.writeFile(
    //         modelImg,
    //         base64Image,
    //         { encoding: "base64" },
    //         function (err) {
    //             console.log(`gltf created`);
    //         }
    //     );
    // }
    imgUid = uuidv4();
    base64Image = query.image[0].split(";base64,").pop();
    modelImg = rootPath + `/${query.uid}.gltf`;
    fs.writeFile(
        modelImg,
        base64Image,
        { encoding: "base64" },
        function (err) {
            console.log(`gltf created`);
        }
    );
    fs.mkdirSync(`./model/preview-img/${query.uid}`, { recursive: true });
    rootPath = `./model/preview-img/${query.uid}`;
    // for (let i = 0; i < query.imagePreview.length; i++) {
    //     imgUid = uuidv4();
    //     let base64Image = query.imagePreview[i].split(";base64,").pop();
    //     imgPath = rootPath + `/${imgUid}.jpg`;
    //     preview.push(imgPath);
    //     fs.writeFile(
    //         imgPath,
    //         base64Image,
    //         { encoding: "base64" },
    //         function (err) {
    //             console.log(`jpg created`);
    //         }
    //     );
    //     if (i == 0) {
    //         previewimg = imgPath;
    //     }
    // }
    imgUid = uuidv4();
    base64Image = query.imagePreview[0].split(";base64,").pop();
    previewImg = rootPath + `/${imgUid}.jpg`;
    fs.writeFile(
        previewImg,
        base64Image,
        { encoding: "base64" },
        function (err) {
            console.log(`jpg created`);
        }
    );
    if (query.imageAddon !== null) {
        fs.mkdirSync(`./model/addon/${query.uid}`, { recursive: true });
        rootPath = `./model/addon/${query.uid}`;
        // for (let i = 0; i < query.imageAddon.length; i++) {
        //     imgUid = uuidv4();
        //     let base64Image = query.imageAddon[i].split(";base64,").pop();
        //     imgPath = rootPath + `/${imgUid}.gltf`;
        //     addon.push(imgPath);
        //     fs.writeFile(
        //         imgPath,
        //         base64Image,
        //         { encoding: "base64" },
        //         function (err) {
        //             console.log(`gltf created`);
        //         }
        //     );
        // }
        imgUid = uuidv4();
        base64Image = query.imageAddon[0].split(";base64,").pop();
        addon = rootPath + `/${imgUid}.gltf`;
        fs.writeFile(
            addon,
            base64Image,
            { encoding: "base64" },
            function (err) {
                console.log(`gltf created`);
            }
        );
        model = {
            title: query.namemodel,
            about: query.detailmodel,
            price: priceNum,
            widthDimension: dimensionNum,
            pathimg: modelImg,
            pathaddon: addon,
            imgforpreview: previewImg,
            uid: query.uid,
            dateModified: serverDate,
        }
    } else {
        model = {
            title: query.namemodel,
            about: query.detailmodel,
            price: priceNum,
            widthDimension: dimensionNum,
            pathimg: modelImg,
            imgforpreview: previewImg,
            uid: query.uid,
            dateModified: serverDate,
        }
    }
    const client = new MongoClient(uri);
    await client.connect();
    let info = await client.db("sbuiltin").collection("model").insertOne(model);
    if (info) {
        console.log("Data inserted");
        let JSONdata = JSON.stringify({
            status: "Completed",
            msg: "Upload completed!",
        });
        client.close();
        res.status(200).end(JSONdata);
        console.log(JSONdata);
    }
    else {
        console.log("Error");
        let JSONdata = JSON.stringify({
            status: "Failed",
            msg: "Error! Cannot connect to database.",
        });
        client.close();
        res.status(401).end(JSONdata);
        console.log(JSONdata);
    }
});

app.listen(port, () => {
    console.log(`server start at port ${port}`);
});
