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

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_IP}:${process.env.DB_PORT}`;

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

app.get("/edit", async (req, res) => {
    // const { title, image64 } = req.body;
    // let query = { title, image64 };
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db("sbuiltin");
    const catalog = database.collection("catalog");
    const model = database.collection("model");
    try {
        //Not finished
        let info = await model.find();
        let info2 = await catalog.find();
        // res.status(200).json(dir);
        // await info2.forEach(console.dir);
        console.log("Hello from get edit");
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
})

app.post("/edit", async (req, res) => {
    var name = req.body.name;
    var detail = req.body.detail;
    var price = req.body.price;
    var chkmodel = req.body.model;
    var img64 = req.body.image;
    const img = { img64 }
    // const { uid } = req.body;

    console.log(chkmodel)
    if (chkmodel == true) {
        var model = {
            title: name,
            about: detail,
            price: price, 
            isModel: chkmodel
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
        }
        else {
            console.log("Error");
            let JSONdata = JSON.stringify({
                status: "๊Failed",
                msg: "Error! Cannot connect to database.",
            });
            client.close();
            res.status(401).end(JSONdata);
        }
    }
    else {
        let path = [];
        let rootPath = './image';
        fs.rmSync(rootPath, { recursive: true });
        fs.mkdirSync(rootPath, { recursive: true });
        let imgUid = uuidv4();
            // let base64Image = img[i].split(";base64,").pop();
            let imgPath = rootPath + `/${imgUid}.jpg`;
            path.push(imgPath);
            fs.writeFile(
              imgPath,
              img64,
            //   { encoding: "base64" },
              function (err) {
                console.log(`jpg created`);
              }
            );
        // for (let i = 0; i < img.length; i++) {
        //     let imgUid = uuidv4();
        //     // let base64Image = img[i].split(";base64,").pop();
        //     let imgPath = rootPath + `/${imgUid}.jpg`;
        //     path.push(imgPath);
        //     fs.writeFile(
        //       imgPath,
        //       img64,
        //     //   { encoding: "base64" },
        //       function (err) {
        //         console.log(`jpg created`);
        //       }
        //     );
        //   }
        var cat = {
            title: name,
            about: detail,
            price: price,
            pathimg: imgPath
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
        }
        else {
            console.log("Error");
            let JSONdata = JSON.stringify({
                status: "๊Failed",
                msg: "Error! Cannot connect to database.",
            });
            client.close();
            res.status(401).end(JSONdata);
        }
    }
});

app.listen(port, () => {
    console.log(`server start at port ${port}`);
});
