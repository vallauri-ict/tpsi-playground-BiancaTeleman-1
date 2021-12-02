import * as mongodb from "mongodb";

const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B"

//PROMISE
//query 1
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("orders");
    //i nomi dei campi devono essere preceduti da "$" se sono usati come valore 
    // a destra dei ':'

    //dopo aver fatto i gruppi con $group il recordset risultante avrà solo 2 colonne
    //  che sono _id e totale, tutti gli altri campi non sono visibili

    let req = collection.aggregate([
      {"$match": {"status":"A"}},
      {"$group": {"_id":"$cust_id", "totale":{"$sum": "$amount"}}},
      {"$sort": {"totale":-1}}
    ]).toArray();
    req.then(function (data){
      console.log("Query 1 ", data);
    })
    req.catch(function(err){
      console.log("Errore esecuzione query: " + err.message);
    })
    req.finally(function(){
      client.close();
    });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});


//query 2
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("orders");
    let req = collection.aggregate([
      {"$group": {
        "_id": "$cust_id",
        "avgAmount" : {"$avg": "$amount"},
        "avgTotal": {"$avg" : {"$multiply": ["$qta", "$amount"]}}
      }} 
    ]).toArray();
    req.then(function (data){
      console.log("Query 2 ", data);
    })
    req.catch(function(err){
      console.log("Errore esecuzione query: " + err.message);
    })
    req.finally(function(){
      client.close();
    });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});


//query 3
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    let req = collection.aggregate([
      {"$match": {"gender":{"$exists":true}}},
      {"$group": { "_id":"$gender", "totale":{"$sum":1}}} 
    ]).toArray();
    req.then(function (data){
      console.log("Query 3", data);
    })
    req.catch(function(err){
      console.log("Errore esecuzione query: " + err.message);
    })
    req.finally(function(){
      client.close();
    });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});


//query 4
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    let req = collection.aggregate([
      {"$match": {"gender":{"$exists":true}}},
      {"$group": { "_id":{"gender":"$gender"}, "mediaVampiri":{"$avg":"$vampires"}}} 
    ]).toArray();
    req.then(function (data){
      console.log("Query 4", data);
    })
    req.catch(function(err){
      console.log("Errore esecuzione query: " + err.message);
    })
    req.finally(function(){
      client.close();
    });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});



//query 5
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    let req = collection.aggregate([
      {"$match": {"gender":{"$exists":true}}},
      {"$group": { "_id":{"gender":"$gender", "hair":"$hair"}, "nEsemplari":{"$sum":1}}},
      {"$sort":{"nEsemplari":-1, "_id":-1}}
    ]).toArray();
    req.then(function (data){
      console.log("Query 5", data);
    })
    req.catch(function(err){
      console.log("Errore esecuzione query: " + err.message);
    })
    req.finally(function(){
      client.close();
    });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});


//query 6
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    let req = collection.aggregate([
      {"$group": { "_id":{}, "media":{"$avg":"$vampires"}}},
      {"$project":{"_id":0, "ris":{"$round":"$media"}}}
    ]).toArray();
    req.then(function (data){
      console.log("Query 6", data);
    })
    req.catch(function(err){
      console.log("Errore esecuzione query: " + err.message);
    })
    req.finally(function(){
      client.close();
    });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});



//query 7
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("quizzes");
    let req = collection.aggregate([
      //le funzioni di aggregazione usate dentro project lavorano sui campi
      // del singolo record
      {"$project":{
         "quizAvg":{"$avg":"$quizzes"},
         "labAvg":{"$avg":"$labs"},
         "examAvg":{"$avg":["$midterm","$final"]}
      }},
      {"$project":{
         "quizAvg":{"$round":["$quizAvg",1]},
         "labAvg":{"$round":["$labAvg",1]},
         "examAvg":{"$round":["$examAvg",1]}
      }},
      {"$group":{
         "_id":{},
         "mediaQuiz":{"$avg":"$quizAvg"},
         "mediaLab":{"$avg":"$labAvg"},
         "mediaExam":{"$avg":"$examAvg"}
      }},
      {"$project":{
        "mediaQuiz":{"$round":["$mediaQuiz",2]},
        "mediaLab":{"$round":["$mediaLab",2]},
        "mediaExam":{"$round":["$mediaExam",2]}
      }}
    ]).toArray();
    req.then(function (data){
      console.log("Query 7", data);
    })
    req.catch(function(err){
      console.log("Errore esecuzione query: " + err.message);
    })
    req.finally(function(){
      client.close();
    });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});



//query 8
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("student");
    let regex = new RegExp("F", "i");
    let req = collection.aggregate([
      {"$project":{"genere":1,"nome":1,"mediaVoti":{"$avg":"$voti"}}},
      {"$match":{"genere":{"$regex":regex}}},
      {"$sort":{"mediaVoti":-1}},
      {"$skip":1},
      {"$limit":1}
    ]).toArray();
    req.then(function (data){
      console.log("Query 8", data);
    })
    req.catch(function(err){
      console.log("Errore esecuzione query: " + err.message);
    })
    req.finally(function(){
      client.close();
    });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});


//query 9
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("orders");
    let req = collection.aggregate([
      {"$project":{"status":1, "nDettagli":1}},
      {"$unwind":"$nDettagli"},
      {"$group":{"_id":"$status", "sommaDettagli":{"$sum":"$nDettagli"}}}
    ]).toArray();
    req.then(function (data){
      console.log("Query 9", data);
    })
    req.catch(function(err){
      console.log("Errore esecuzione query: " + err.message);
    })
    req.finally(function(){
      client.close();
    });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});


//query 10
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("student");
    let req = collection.find({"$expr":{"$gte":[{"$year":"$nato"},2000]}}).toArray();
    req.then(function (data){
      console.log("Query 10", data);
    })
    req.catch(function(err){
      console.log("Errore esecuzione query: " + err.message);
    })
    req.finally(function(){
      client.close();
    });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});


