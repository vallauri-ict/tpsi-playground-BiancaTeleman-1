import express from "express";
import * as fs from "fs";
import * as http from "http";
import * as body_parser from "body-parser";
import { inherits } from "util";
//import HEADERS from "./headers.json";
import * as mongodb from "mongodb";
import cors from "cors";
import fileUpload, {UploadedFile} from "express-fileupload"
import ENVIRONMENT from "./environment.json";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name:ENVIRONMENT["CLOUD-NAME"],
  api_key:ENVIRONMENT.CLOUDINARY.API_KEY,
  api_secret:ENVIRONMENT.CLOUDINARY.API_SECRET,
  
})


const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING=process.env.MONGODB_URI || "mongodb+srv://Bianca:bianca03@cluster0.sxrct.mongodb.net/5B?retryWrites=true&w=majority"
/*const CONNECTION_STRING =
  "mongodb+srv://Bianca:bianca03@cluster0.sxrct.mongodb.net/5B?retryWrites=true&w=majority";*/
const DB_NAME = "recipeBook";


const port = parseInt(process.env.PORT) || 1337
let app = express();

let server = http.createServer(app);

server.listen(port,function(){
    console.log("Server in ascolto sulla porta " + port)
    
    init();
});
const whitelist = ["http://localhost:4200", "https://localhost:1337",
                  "https://bianca-teleman-crud-server.herokuapp.com/",
                  "http://bianca-teleman-crud-server.herokuapp.com/"];
const corsOptions = {
 origin: function(origin, callback) {
 if (!origin)
 return callback(null, true);
 if (whitelist.indexOf(origin) === -1) {
 var msg = 'The CORS policy for this site does not ' +
 'allow access from the specified Origin.';
 return callback(new Error(msg), false);
 }
 else
 return callback(null, true);
 },
 credentials: true
};
app.use("/", cors(corsOptions) as any);

//6. fileupload
app.use(fileUpload({
  "limits":{"fileSize":(10*1024*1024)} //10 MB
}))


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
// middleware di apertura della connessione
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

  //lettura delle collezioni presenti nel db
  app.get("/api/getCollections", (req, res, next) => {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let request = db.listCollections().toArray();
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

  //middleware di intercettazione dei parametri
  let currentCollection = "";
  let id = ""
  //:id? diventa un campo facoltativo
  
  // listener specifici
  app.get("/api/images", (req, res, next) => {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection("images");
    let request = collection.insertOne(req["body"]);
    request.then((data) => {
      res.send(data);
      });
      request.catch((err) => {
      res.status(503).send("Sintax error in the query");
      });
      request.finally(() => {
      req["client"].close();
    });

    app.post('/api/uploadBinary', function (req, res, next) {
      let db=req["client"].db(DB_NAME) as mongodb.Db;
      if (!req.files || Object.keys(req.files).length == 0|| !req.body.username)
        res.status(400).send('No files were uploaded');
      else{
        let _file = req.files.img as UploadedFile;
        _file.mv('./static/img/' + _file["name"], function(err) {
     if (err)
        res.status(500).json(err.message);
     else
         collection = db.collection("images");
     let user={"username":req.body.username,
                "img":_file.name}
     let request = collection.insertOne(req["body"]);
     request.then((data) => {
       res.send(data);
       });
       request.catch((err) => {
       res.status(503).send("Sintax error in the query");
       });
       request.finally(() => {
       req["client"].close();
      })
      }
     );

     app.post("/api/cloudinary", (req, res, next) => {
      let db = req["client"].db(DB_NAME) as mongodb.Db;
      let collection = db.collection("images");
      let request = collection.insertOne(req["body"]);
      request.then((data) => {
        res.send(data);
        });
        request.catch((err) => {
        res.status(503).send("Sintax error in the query");
        });
        request.finally(() => {
        req["client"].close();
      });
    })

}});
  

//****************************************************************
//default route(risorse non trovate) e route di gestione degli errori
//****************************************************************
app.use("/", function(err, req, res, next){
    console.log("***************  ERRORE CODICE SERVER ", err.message, "  *****************");
})



  })