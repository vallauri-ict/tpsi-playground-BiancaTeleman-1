"use strict"

import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
const HEADERS = require("./headers.json")


const PORT = 1337;
let paginaErrore: string;

var server = _http.createServer(function(req, res) {
    let metodo=req.method;
    //parsing della url ricevuta
    let url=_url.parse(req.url, true); //devo mettergli true per fargli parsificare anche i parametri
    let risorsa=url.pathname;
    let parametri=url.query;
    console.log(`Richiesta: ${metodo}-${risorsa},param: ${JSON.stringify(parametri)}`)

    if(risorsa=="/")
    {
        risorsa="/index.html";
    }
    if(!risorsa.startsWith("/api/"))
    {
        risorsa="./static"+risorsa;
        _fs.readFile(risorsa, function(error,data){
            if(!error)
            {
                let header={"Content-Type":_mime.getType(risorsa)}
                res.writeHead(200,header);
                res.write(data);
                res.end();
            }
            else
            {
                res.writeHead(404,HEADERS.html);
                res.write(paginaErrore);
                res.end();
            }
        })
    }
    else if(risorsa=="/api/servizio1")
    {
        //gestione servizio
        let json={"ris":"ok"};
        res.writeHead(200,HEADERS.json);
        res.write(JSON.stringify(json));
        res.end();
    }
    else
    {
        res.writeHead(404,HEADERS.text);
        res.write("Servizio inesistente");
        res.end();
    }
});

server.listen(PORT,function()
{
    _fs.readFile("./static/error.html",function(errore,data)
    {
        if(!errore)
        {
            paginaErrore=data.toString();
        }
        else
        {
            paginaErrore="<h1>Pagina non trovata</h1>"
        }
    })
});
console.log("server in esecuzione sulla porta "+PORT);
