import * as _http from "http";
import HEADERS from "./headers.json"
import {Dispatcher} from "./dispatcher"
import * as mongodb from "mongodb";
const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B"

let port : number = 1337;

let dispatcher : Dispatcher =  new Dispatcher();

let server = _http.createServer(function(req, res){
    dispatcher.dispatch(req, res);
})
server.listen(port);
console.log("Server in ascolto sulla porta " + port);

//Registrazione del servizio 
dispatcher.addListener("POST", "/api/servizio1", function(req, res){
    let dataStart = new Date(req["BODY"].dataStart);
    let dataEnd = new Date(req["BODY"].dataEnd);
    //query 1 elenco studenti
    mongoClient.connect(CONNECTION_STRING, (err, client) => {
    if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("vallauri");
      collection.find({"$and":[{"$gte":{"dob":dataStart}}, {"$lte":{"dob":dataEnd}}]})
      .project({"nome":1, "classe":1})
      .toArray((err, data) => {
        if (!err) {
            res.writeHead(200,HEADERS.json);
            res.write(JSON.stringify(data));
            res.end();
        } else {
            res.writeHead(500,HEADERS.text);
            res.write("Errore esecuzione query");
            res.end();
        }
        client.close();
      });
    } else{
      console.log("Errore connessione al db: " + err.message);
    }
    });  
});
