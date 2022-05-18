"use strict"

// ***************************** Librerie *************************************
import fs from "fs";
import http from "http";
import express from "express";
import body_parser from "body-parser";
import cors from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
import cloudinary, { UploadApiResponse } from "cloudinary";
import {MongoClient, ObjectId}  from "mongodb";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import environment from "./environment.json"
import { getDefaultLibFileName } from "typescript";
import * as nodemailer from "nodemailer";


// ***************************** Costanti *************************************
const app = express();
//const CONNECTION_STRING = environment.CONNECTION_STRING_ATLAS
const DBNAME = "progetto"
const DURATA_TOKEN = 45464156313 // sec
let port : number = parseInt(process.env.PORT) || 1337
const HTTP_PORT = 1337
//const HTTPS_PORT = 1338
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8");
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const jwtKey = fs.readFileSync("keys/jwtKey.pem", "utf8");
const credentials = { "key": privateKey, "cert": certificate };
cloudinary.v2.config({
	cloud_name: environment.cloudinary.CLOUD_NAME,
	api_key: environment.cloudinary.API_KEY,
	api_secret: environment.cloudinary.API_SECRET,
})


// ***************************** Avvio ****************************************
const httpServer = http.createServer(/*credentials,*/ app);
httpServer.listen(port, function() {
    console.log("Server HTTP in ascolto sulla porta " + port);
    init();
});
const CONNECTION_STRING = process.env.MONGODB_URI || environment.CONNECTION_STRING_ATLAS
let paginaErrore = "";
function init() {
    fs.readFile("./static/error.html", function(err, data) {
        if (!err)
            paginaErrore = data.toString();
        else
            paginaErrore = "<h1>Risorsa non trovata</h1>"
    });
}
// app.response.log = function(err){console.log(`*** Error *** ${err.message}`)}
app.response["log"] = function(err){console.log(`*** Error *** ${err.message}`)}


/* *********************** (Sezione 1) Middleware ********************* */
// 1. Request log
app.use("/", function(req, res, next) {
    console.log("** " + req.method + " ** : " + req.originalUrl);
    next();
});


// 2 - route risorse statiche
app.use("/", express.static('./static'));


// 3 - routes di lettura dei parametri post
app.use("/", body_parser.json({ "limit": "10mb" }));
app.use("/", body_parser.urlencoded({"extended": true, "limit": "10mb"}));


// 4 - log dei parametri 
app.use("/", function(req, res, next) {
    if (Object.keys(req.query).length > 0)
        console.log("        Parametri GET: ", req.query)
    if (Object.keys(req.body).length != 0)
        console.log("        Parametri BODY: ", req.body)
    next();
});


// 5. cors accepting every call
const corsOptions = {
    origin: function(origin, callback) {
          return callback(null, true);
    },
    credentials: true,
    allowedHeaders:['Content-Type','authorization'],
    exposedHeaders:["authorization"]
};
app.use("/", cors(corsOptions));


// 6 - binary upload
app.use("/", fileUpload({
    "limits": { "fileSize": (10 * 1024 * 1024) } // 10*1024*1024 // 10 M
}));


/* ***************** (Sezione 2) middleware relativi a JWT ****************** */
// gestione login
app.post("/api/login",function(req,res,next){
    MongoClient.connect(CONNECTION_STRING, function(err,client){
        if(err){
            res.status(501).send("Errore connessione al DB")["log"](err);
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("admin");
            let username = req.body.username;
            console.log(username)
            // controllo key unsensitive
            let regex = new RegExp("^" + username + "$","i");
            collection.findOne({"username":regex},function(err,dbUser){
                console.log(dbUser)
                if(err){
                    res.status(500).send("Errore esecuzione query");
                }
                else{
                    if(!dbUser){
                        res.status(401).send("Username non valido");
                    }
                    else{
                        if(req.body.password){
                            if(bcrypt.compareSync(req.body.password,dbUser.password))
                            {
                                let token = creaToken(dbUser);
                                // salvo il token nell'header
                                res.setHeader("authorization",token);
                                res.send({"ris":dbUser._id});
                            }
                            else
                            {
                                res.status(401).send("Password non valida");
                            }
                        }
                        else
                        {
                            res.status(401).send("Username non valido");
                        }
                    }
                }
            });
        }
    })
});

app.post("/api/loginOperatori",function(req,res,next){
    MongoClient.connect(CONNECTION_STRING, function(err,client){
        if(err){
            res.status(501).send("Errore connessione al DB")["log"](err);
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("utente");
            let username = req.body.username;
            console.log(username)
            // controllo key unsensitive
            let regex = new RegExp("^" + username + "$","i");
            collection.findOne({"username":regex},function(err,dbUser){
                console.log(dbUser)
                if(err){
                    res.status(500).send("Errore esecuzione query");
                }
                else{
                    if(!dbUser){
                        res.status(401).send("Username non valido");
                    }
                    else{
                        if(req.body.password){
                            if(bcrypt.compareSync(req.body.password,dbUser.password))
                            {
                                let token = creaToken(dbUser);
                                // salvo il token nell'header
                                res.setHeader("authorization",token);
                                res.send({"ris":dbUser._id});
                            }
                            else
                            {
                                res.status(401).send("Password non valida");
                            }
                        }
                        else
                        {
                            res.status(401).send("Username non valido");
                        }
                    }
                }
            });
        }
    })
});

app.use("/",function(req,res,next){
    let token;
    if(req.headers.authorization){
        token = req.headers.authorization;
        // jwt.verify inietta il payload del token alla funzione di callback
        jwt.verify(token,jwtKey,function(err,payload){
            if(err){
                res.status(403).send("Unauthorized: token non valido");
            }
            else{
                // si rinnova il token prima del next
                let newToken = creaToken(payload);
                res.setHeader("authorization",newToken);
                req["payload"] = payload;
                next();
            }
        })
    }
    else{
        res.status(403).send("Token assente");
    }
})

function creaToken(dbUser){
    let data = Math.floor((new Date()).getTime() / 1000); // ottengo i secondi arrotondati
    let payload = {
        "_id":dbUser._id,
        "username":dbUser.username,
        "iat": dbUser.iat || data,
        "exp": data + DURATA_TOKEN // scadenza del token
    };
    let token = jwt.sign(payload,jwtKey);
    return token;
}


/* ********************** (Sezione 3) USER ROUTES  ************************** */
// gestione elenco delle mail utente

let transporter = nodemailer.createTransport({"service":"gmail",
                                            "auth":environment.MAILCREDENTIALS});
app.post("/api/creaUtente",function(req,res,next)
{
    MongoClient.connect(CONNECTION_STRING,function(err,client){
        if(err){
            res.status(503).send("Errore connessione al DB");
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("utente");
            let email=req.body.email;
            let username=req.body.username;
            //let password=req.body.password;
            console.log(email+" - "+username)
            let password=generaPassword(10);
            let newUser={"email":email,"username":username,"password":bcrypt.hashSync(password)}
            
            let mailOptions = {"from":environment.MAILCREDENTIALS.user,"to":email,"subject":"Rilievi e perizie",
            "html":"<p>La password per accedere è la seguente:"+password+"</p>"};

            transporter.sendMail(mailOptions, function (err, data) {
                if(!err)
                {
                    console.log("mail inviata correttamente");
                    return { "ris" : "ok" };
                }
                else
                {
                    console.log("mail non inviata: " + err.message);
                    return "Errore invio mail: " + err.message;
                }
            })
            let request = collection.insertOne(newUser)
            request.then(function(data){
               
                res.send(data);
            });
            request.catch(function(){
                res.status(500).send("Errore esecuzione query");
            })
            request.finally(function(){
                client.close();
            })
            
        }
    })
})

app.get("/api/location",function(req,res,next){
    MongoClient.connect(CONNECTION_STRING,function(err,client){
        if(err){
            res.status(503).send("Errore connessione al DB");
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("perizie");
                let request = collection.find().toArray();
                request.then(function(data){
                    res.send(data);
                });
                request.catch(function(){
                    res.status(500).send("Errore esecuzione query");
                })
                request.finally(function(){
                    client.close();
                })
        }
    });
});

app.post("/api/modifica",function(req,res,next){
    MongoClient.connect(CONNECTION_STRING,function(err,client){
        if(err){
            res.status(503).send("Errore connessione al DB");
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("perizie");
            let id=req.body._id
            let oid = new ObjectId(id);
            let campo=req.body.campo;
            let testo=req.body.testo;
            let linkImg=req.body.link;
            if(campo=="descrizione")
            {
                let request = collection.updateOne({"_id":oid},{$set:{"descrizione":testo}});
                request.then(function(data){
                    res.send(data);
                });
                request.catch(function(){
                    res.status(500).send("Errore esecuzione query");
                })
                request.finally(function(){
                    client.close();
                })
            }
            else
            {
                let request = collection.updateOne({"_id":oid,"foto.link":linkImg},{$set:{"foto.$.commento":testo}});
                request.then(function(data){
                    res.send(data);
                });
                request.catch(function(){
                    res.status(500).send("Errore esecuzione query");
                })
                request.finally(function(){
                    client.close();
                })
            }
            
        }
    });
});

app.get("/api/filtra/:_id",function(req,res,next){
    MongoClient.connect(CONNECTION_STRING,function(err,client){
        if(err){
            res.status(503).send("Errore connessione al DB");
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("perizie");
            let id_oper=req.params._id;
            let oid = new ObjectId(id_oper);
            let request = collection.find({"id_oper":oid}).toArray();
            request.then(function(data){
                res.send({"ris":data});
            });
            request.catch(function(){
                res.status(500).send("Errore esecuzione query");
            })
            request.finally(function(){
                client.close();
            })
                
            
        }
    });
});

app.post("/api/checkUser",function(req,res,next){
    MongoClient.connect(CONNECTION_STRING,function(err,client){
        if(err){
            res.status(503).send("Errore connessione al DB");
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("utente");
            let username=req.body.username;
            let request = collection.find({"username":username}).toArray();
            request.then(function(data){
                console.log(data)
                    res.send({"ris":data});
            });
            request.catch(function(){
                res.status(500).send("Errore esecuzione query");
            })
            request.finally(function(){
                client.close();
            })
        }
    });
});
function generaPassword(n)
{
    let ris="";
    let string="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz12345677890.!@";
    for(let i=0;i<n;i++)
    {
        ris+=string.charAt(Math.floor(Math.random()*string.length));
    }
    return ris;
}

app.post("/api/uploadCampi",function(req,res,next)
{
    MongoClient.connect(CONNECTION_STRING,function(err,client){
        if(err){
            res.status(503).send("Errore connessione al DB");
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("perizie");
            /*let id_oper=req.body.id_oper;
            let descrizione=req.body.descrizione;
            let data=req.body.data;
            let lat=req.body.lat;
            let long=req.body.long;
            let citta=req.body.citta;

            
            let newPerizia={
                "id_oper":id_oper,
                "descrizione":descrizione,
                "data":data,
                "lat":lat,
                "long":long,
                "citta":citta
            }*/
            let newPerizia=req.body;
            let id=req.body.id_oper
            let oid = new ObjectId(id);
            newPerizia.id_oper=oid;
            console.log(newPerizia)
            let request = collection.insertOne(newPerizia)
            request.then(function(data){
               
                res.send(data);
            });
            request.catch(function(){
                res.status(500).send("Errore esecuzione query");
            })
            request.finally(function(){
                client.close();
            })
            
        }
    })
})

app.post("/api/cloudinaryBase64", function (req, res, next) {
    cloudinary.v2.uploader.upload(req.body.image, { "folder": "progetto" })
        .catch((error) => {
            res.status(500).send("Errore nel caricamento del file su cloudinary");
        })
        .then((result: UploadApiResponse) => {
            res.send({"url":result.secure_url}) 
        })
})
/* ***************** (Sezione 4) DEFAULT ROUTE and ERRORS ******************* */
// gestione degli errori
app.use(function(err, req, res, next) {
    console.log(err.stack); // stack completo    
});

// default route
app.use('/', function(req, res, next) {
    res.status(404)
    if (req.originalUrl.startsWith("/api/")) {
        res.send("Risorsa non trovata");
    }
	else res.send(paginaErrore);
});