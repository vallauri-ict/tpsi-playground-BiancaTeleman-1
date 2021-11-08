"use strict"

import * as _http from 'http'
import { Dispatcher } from "./dispatcher"
import HEADERS from "./headers.json"
import * as _mongodb from "mongodb"

const mongoClient = _mongodb.MongoClient
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017"
const DBNAME = "5B"

// query 1
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.find({ "weight": { "$lte": 800, "$gte": 700 } }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 1 - ", "N record: " + data.length, data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })
    } else {
        console.log("Errore connessione al db")
    }
})

// query 2
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.find({ "$and": [{ "gender": "m" }, { "loves": { "$in": ["grape", "apple"] } }, { "vampires": { "$gt": 60 } }] }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 2 - ", "N record: " + data.length, data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })
    } else {
        console.log("Errore connessione al db")
    }
})

// query 2 bis
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.find({ "$and": [{ "gender": "m" }, { "loves": { "$in": ["grape", "apple"] } }, { "vampires": { "$gt": 60 } }] }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 2 bis - ", "N record: " + data.length, data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })
    } else {
        console.log("Errore connessione al db")
    }
})

// query 3
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.find({ "$or": [{ "gender": "f" }, { "weight": { "$lte": 700 } }] }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 3 - ", "N record: " + data.length, data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })
    } else {
        console.log("Errore connessione al db")
    }
})

// query 4
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.find({ "$and": [{ "loves": { "$in": ["apple", "grape"] } }, { "vampires": { "$gte": 60 } }] }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 4 - ", "N record: " + data.length, data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })
    } else {
        console.log("Errore connessione al db")
    }
})

// query 5
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.find({ "loves": { "$all": ["grape", "watermelon"] } }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 5 - ", "N record: " + data.length, data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })
    } else {
        console.log("Errore connessione al db")
    }
})

// query 6
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.find({ "$or": [{ "hair": "brown" }, { "hair": "grey" }] }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 6 - ", "N record: " + data.length, data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })
    } else {
        console.log("Errore connessione al db")
    }
})

// query 6 bis
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.find({ "hair": { "$in": ["grey", "brown"] } }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 6 bis - ", "N record: " + data.length, data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })
    } else {
        console.log("Errore connessione al db")
    }
})

// query 7
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.find({ "$and": [{ "vaccinated": { "$exists": true } }, { "vaccinated": true }] }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 7 - ", "N record: " + data.length, data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })
    } else {
        console.log("Errore connessione al db")
    }
})

// query 9
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        let regex = new RegExp("^A", "i")
        collection.find({ "$and": [{ "name": { "$regex": regex } }, { "gender": "f" }] }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 9 - ", "N record: " + data.length, data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })
    } else {
        console.log("Errore connessione al db")
    }
})

// query 10
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.find({ "_id": new _mongodb.ObjectId("61823940801d3dfa6c72ec32") }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 10 - ", "N record: " + data.length, data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })
    } else {
        console.log("Errore connessione al db")
    }
})

// query 11 a
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.find({ "gender": "m" }).project({ "name": 1, "vampires": 1, "_id": 0 }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 11a - ", "N record: " + data.length, data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })
    } else {
        console.log("Errore connessione al db")
    }
})

// query 11 b
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.find({ "gender": "m" }).project({ "name": 1, "vampires": 1, "_id": 0 }).sort({ "vampires": -1, "name": 1 }).skip(1).limit(3).toArray(function (err, data) {
            if (!err) {
                console.log("Query 11b - ", "N record: " + data.length, data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })
    } else {
        console.log("Errore connessione al db")
    }
})

// query 12
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.find({ "weight": { "$gt": 500 } }).count(function (err, data) {
            if (!err) {
                console.log("Query 12", data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })
    } else {
        console.log("Errore connessione al db")
    }
})

// query 13
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.findOne({"name": "Aurora"},{"projection": { "weight": 1, "hair":1}}, (err, data) => {
            if (!err) {
                console.log("Query 13 ", data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close()
        })

    } else {
        console.log("Errore connessione al db")
    }
})
//query 14 a casa
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.distinct("loves",{"gender":"f"},function(err,data){
            if (!err) {
                console.log("Query 14 ", data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close();
        })
    } else {
        console.log("Errore connessione al db")
    }
})


//query 15
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        let uni={"name":"Hornysss",  "dob":"1992-02-13", "loves": ["carrot","papaya"], "weight": 600, "gender": "m", "vampires":63, "hair":"grey"}
        collection.insertOne(uni,function(err,data)
        {
            if (!err) {
                console.log("Query 15 ", data)

            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            //client.close();
        })
        collection.deleteOne({"name":"Hornysss"},function(err,data)
        {
            if (!err) {
                console.log("Rimosso correttamente")
            } 
            else 
            {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close();
        })
        
    } else {
        console.log("Errore connessione al db")
    }
})

//query 16
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.updateOne({"name":"Pilot"},{$inc: {vampires: +1}},function(err,data){
            if (!err) {
                console.log("Query 16 ", data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close();
        })
    } else {
        console.log("Errore connessione al db")
    }
})

//query 17
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        collection.updateOne({"name":"Aurora"},{$push: {loves: 'carrots'},$inc: {weight: +10}},function(err,data){
            if (!err) {
                console.log("Query 17 ", data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close();
        })
    } else {
        console.log("Errore connessione al db")
    }
})
//query 18
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME)
        let collection = db.collection("unicorns")
        let ris=collection.updateMany({ vaccinated: {"$exists": false}},{$set:{"vaccinated":false}},function(err,data){
            if (!err) {
                console.log("Query 18 ", data)
            } else {
                console.log("Errore esecuzione query " + err.message)
            }
            client.close();
        })

    } else {
        console.log("Errore connessione al db")
    }
})
