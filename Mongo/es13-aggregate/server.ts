"use strict"

import * as _http from 'http'
import { Dispatcher } from "./dispatcher"
import HEADERS from "./headers.json"
import * as _mongodb from "mongodb"

const mongoClient = _mongodb.MongoClient
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017"
const DBNAME = "5B"

// query 1
mongoClient.connect(CONNECTIONSTRING,(err, client) => {
    if (!err) {
        let db = client.db(DBNAME)

        let collection = db.collection("orders")
        //i nomi dei campi devono essere sempre preceduti dal $ se usati a destra dei :, usati quindi come valori
        //dopo aver fatto i gruppi con $group il recordset risultante avrà solo due colonne
        // che sono _id e totale, gli altri campi non sono disponibili
        let req=collection.aggregate([
            {"$match":{"status":"A"}},
            {"$group":{"_id":"$cust_id","totale":{"$sum":"$amount"}}},
            //se uso il campo come chiave non mi serve mettere il $(quindi a sinistra)
            {"$sort":{"amount":-1}}
            ]).toArray();
        req.then(function(data)
        {
            console.log("Query 1", data)
        })
        req.catch(function(err)
        {
            console.log("Errore esecuzione query " + err.message)
        })
        req.finally(function()
        {
            client.close();
        })        
            
    }
     else {
        console.log("Errore connessione al db")
    }
})

//query 2
mongoClient.connect(CONNECTIONSTRING,(err, client) => {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("orders")
        let req=collection.aggregate([
            {"$group":{ //con $group il primo parametro è sempre id
                "_id":"$cust_id",
                "avgAmount":{"$avg":"$amount"},
                "avgTotal":{"$avg":{"$multiply":["$qta","$amount"]}}}}  
            ]).toArray();
        req.then(function(data)
        {
            console.log("Query 2", data)
        })
        req.catch(function(err)
        {
            console.log("Errore esecuzione query " + err.message)
        })
        req.finally(function()
        {
            client.close();
        })        
            
    }
     else {
        console.log("Errore connessione al db")
    }
})

//query 3
mongoClient.connect(CONNECTIONSTRING,(err, client) => {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        let req=collection.aggregate([
            //l'aggregate lavora a catena
            {"$match":{"gender":{"$exists":true}}},
            {"$group":{
                "_id":"$gender", //id è il campo in cui vado a raggruppare
                "totale":{"$sum":1}
            }}  
            ]).toArray();
        req.then(function(data)
        {
            console.log("Query 3", data)
        })
        req.catch(function(err)
        {
            console.log("Errore esecuzione query " + err.message)
        })
        req.finally(function()
        {
            client.close();
        })        
            
    }
     else {
        console.log("Errore connessione al db")
    }
})

//query 4
mongoClient.connect(CONNECTIONSTRING,(err, client) => {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        let req=collection.aggregate([
            {"$group":{
                "_id":{"gender":"$gender"},
                "mediaVampiri":{"$avg":"$vampires"}
            }}  
            ]).toArray();
        req.then(function(data)
        {
            console.log("Query 4", data)
        })
        req.catch(function(err)
        {
            console.log("Errore esecuzione query " + err.message)
        })
        req.finally(function()
        {
            client.close();
        })        
            
    }
     else {
        console.log("Errore connessione al db")
    }
})

//query 5
mongoClient.connect(CONNECTIONSTRING,(err, client) => {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        let req=collection.aggregate([
            {"$match":{"gender":{"$exists":true}}},
            {"$group":{
                "_id":{"gender":"$gender"},
                "hair":"$hair"},"nEsemplari":{"$sum":1}},
                {"$sort":{"nEsemplari":-1,"_id":-1}}
            ]).toArray();
        req.then(function(data)
        {
            console.log("Query 4", data)
        })
        req.catch(function(err)
        {
            console.log("Errore esecuzione query " + err.message)
        })
        req.finally(function()
        {
            client.close();
        })        
            
    }
     else {
        console.log("Errore connessione al db")
    }
})