import * as _http from "http"
import HEADERS from "./headers.json"
import {Dispatcher} from "./dispatcher"
import * as _mongodb from "mongodb"
const MONGOCLIENT=_mongodb.MongoClient;
let port:number = 1337

let dispatcher = new Dispatcher();

let server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res)
})
server.listen(port)
console.log("Server in ascolto sulla porta " + port)

// Registrazione dei servizi
MONGOCLIENT.connect("mongodb://127.0.0.1:27017",function(err,client)
{
    if(!err)
    {
        let db=client.db("5B_Studenti");
        let collection=db.collection("Studenti");
        collection.find().toArray(function(err,data)
        {
            if(!err)
            {
                console.log(data);
            }
            else
            {
                (console.log("Errore eseecuione query "+err.message));
            }
            client.close();
        })
    }
    else
    {
        console.log("Errore nella connessione del database "+err.message);
    }
})

//inserimento di un nuovo record
MONGOCLIENT.connect("mongodb://127.0.0.1:27017",function(err,client)
{
    if(!err)
    {
        let db=client.db("5B_Studenti");
        let collection=db.collection("Studenti");
        let student={"Nome":"Giovanni","hobbies":["Basket","Nuoto"],"Indirizzo":"Informatica","Sezione":"D","lavoratore":false,"CAP":12045}
        collection.insertOne(student,function(err,data)
        {
            if(!err)
            {
                console.log(data);
            }
            else
            {
                console.log("Errore nella connessione del database "+err.message);
            }
        })
        client.close();
    }
    else
    {
        console.log("Errore nella connessione del database "+err.message);
    }
})