import express from "express";
import * as fs from "fs";
import * as http from "http";
import * as body_parser from "body-parser";
import { inherits } from "util";
import HEADERS from "./headers.json";
import * as mongodb from "mongodb";

const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING =
  "mongodb://admin:admin@cluster0-shard-00-00.zarz7.mongodb.net:27017,cluster0-shard-00-01.zarz7.mongodb.net:27017,cluster0-shard-00-02.zarz7.mongodb.net:27017/test?replicaSet=atlas-bgntwo-shard-0&ssl=true&authSource=admin";
const DB_NAME = "5B";


let port : number = 1337;
let app = express();

let server = http.createServer(app);

server.listen(port,function(){
    console.log("Server in ascolto sulla porta " + port)
    init();
});

let paginaErrore="";
function init(){
    fs.readFile("./static/error.html",function(err, data){
        if(!err){
            paginaErrore = data.toString();
        }
        else{
            paginaErrore = "<h2>Risorsa non trovata</h2>";
        }
    });
}


//****************************************************************
//elenco delle routes di tipo middleware
//****************************************************************
// 1.log 
app.use("/",function(req, res, next){
    console.log("---->" + req.method + ":"+ req.originalUrl);
    next();
});

// 2.static route
//il next lo fa automaticamente quando non trova la risorsa
app.use("/", express.static("./static"));

// 3.route lettura parametri post
app.use("/", body_parser.json());
app.use("/", body_parser.urlencoded({"extended":true}));

// 4.log parametri
app.use("/", function(req, res, next){
    if(Object.keys(req.query).length > 0){
        console.log("Parametri GET: ",req.query);
    }
    if(Object.keys(req.body).length > 0){
        console.log("Parametri BODY: ",req.body);
    }
    next();
})


//****************************************************************
//elenco delle routes di risposta al client
//****************************************************************
// 5 risposta al client
app.use("/", (req, res, next) => {
    mongoClient.connect(CONNECTION_STRING, (err, client) => {
      if (err) {
        res.status(503).send("Db connection error");
      } else {
        console.log("Connection made");
        req["client"] = client;
        next();
      }
    });
  });
  //6
  app.get("/api/servizio1", (req, res, next) => {
    let unicorn = req.query.name;
    if (unicorn) {
      let db = req["client"].db(DB_NAME) as mongodb.Db;
      let collection = db.collection("unicorns");
      let request = collection.find({ name: unicorn }).toArray();
      request.then((data) => {
        res.send(data);
      });
      request.catch((err) => {
        res.status(503).send("Sintax error in the query");
      });
      request.finally(() => {
        req["client"].close();
      });
    } else {
      res.status(400).send("UnicornName missing parameter");
      req["client"].close();
    }
  });
  //7
  app.get("/api/servizio3/:gender/:hair", (req, res, next) => {
    let gender = req.params.gender;
    let hair = req.params.hair;

    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection("unicorns");
    let request = collection.find({"$and":[{"gender":gender},{"hair": hair}]}).toArray();
    request.then((data) => {
    res.send(data);
    });
    request.catch((err) => {
    res.status(503).send("Sintax error in the query");
    });
    request.finally(() => {
    req["client"].close();
    });
});
  

//****************************************************************
//default route(risorse non trovate) e route di gestione degli errori
//****************************************************************
app.use("/", function(err, req, res, next){
    console.log("Errore codice server", err.message );
})



