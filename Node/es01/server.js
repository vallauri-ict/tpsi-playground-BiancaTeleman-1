
const _http = require("http"); //puntatore alla libreria
const _url = require("url");
const _colors=require("colors");
let HEADERS = require("./headers.json")  // ./ è la carella corrente

let port = 1337;

//crea un web server e mi faccio restituire un puntatore
let server=_http.createServer(function (req, res) { 
    /*res.writeHead(200, HEADERS.text);  //indichiamo al client che è una risposta testuale
	res.write("richiesta eseguita correttamente");
    res.end();
    console.log("richiesta eseguita");  prima prova base*/
	
    //lettura di metodo risorsa e parametri
    let metodo=req.method;
    //parsing della url ricevuta
    let url=_url.parse(req.url, true); //devo mettergli true per fargli parsificare anche i parametri
    let risorsa=url.pathname;
    let parametri=url.query;
    
    let dominio=req.headers.host;

    res.writeHead(200,HEADERS.html);
    res.write("<h1>Informazioni relaive alla richiesta ricevuta </h1>");
    res.write("<br>");
    res.write(`<p><b> Risorsa richiesta: </b> ${risorsa} </p>`);
    res.write(`<p><b> Metodo: </b> ${metodo} </p>`);
    res.write(`<p><b> Parametri: </b> ${JSON.stringify(parametri)} </p>`);
    res.write(`<p><b> Dominio: </b> ${dominio} </p>`);
    res.write(`<p> Grazie per la richiesta </p>`);
    res.end();
    console.log("Richiesta ricevuta"+req.url.yellow);
	
});

// se non si specifica l'indirizzo IP di ascolto il server viene avviato su tutte le interfacce
server.listen(port);  //faccio partire il server
console.log("server in ascolto sulla porta " + port);