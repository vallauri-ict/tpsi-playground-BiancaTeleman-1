
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
//import { inherits } from "util";
let HEADERS =require("./headers.json");
//import { threadId } from "worker_threads";

let paginaErrore: string;

class Dispatcher
{
    prompt:string=">>> "
    /*ogni listener è costituito d un json del tipo
    {"risorsa";"callack"}
    I listeners sono suddivisi in base al metodo di chiamata*/
    listeners:any={
        "GET":{},
        "POST":{},
        "DELETE":{},
        "PUT":{},
        "PATCH":{}
    }
    constructor(){
        init();
    }

    addListener(metodo:string, risorsa:string, callback:any){
        metodo=metodo.toUpperCase();
        /*if(this.listeners[metodo]) //per accedere a meodi o proprietà di una classe si usa this
        {

        }*/
        if(metodo in this.listeners)
        {
            this.listeners[metodo][risorsa]=callback;
        }
        else
        {
            throw new Error("MEtodo non valido")
        }
    }
    
    dispatch(req,res)
    {
        let metodo=req.method;
        //parsing della url ricevuta
        let url=_url.parse(req.url, true); //devo mettergli true per fargli parsificare anche i parametri
        let risorsa=url.pathname;
        let parametri=url.query;
        console.log(`Richiesta: ${this.prompt} ${metodo} : ${risorsa} ${JSON.stringify(parametri)}`)

        if(risorsa.startsWith("/api/"))
        {
            if(risorsa in this.listeners[metodo])
            {
                let _callback=this.listeners[metodo][risorsa];
                //lancio in esecuzione la callback
                _callback();
            }
            else
            {
                //il client si aspetta un json
                //in caso di errore al posto del JSON 
                //restituiamo una stringa
                res.writeHead(404,HEADERS.text);
                res.write("Servizio non trovato");
                res.end();
            }
        }
        else
        {
            staticListener(req,res,risorsa);
        }
    }
}
module.exports=new Dispatcher();

function staticListener(req,res,risorsa)
{
    if(risorsa=="/")
    {
        risorsa="/index.html";
    }
    let fileName="./static"+risorsa; //risorsa comincia sempre per /
    _fs.readFile(fileName,function(err,data)
    {
        if(!err)
        {
            let header={"Content-Type":_mime.getType(fileName)};
            res.writeHead(200,header);
            res.write(data);
            res.end();
        }
        else
        {
            console.log(`         ${err.code} : ${err.message}`)
            //il client si aspetta una pagina
            res.writeHead(404,HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }
    })
    
}

function init()
    {
        _fs.readFile("./static/error.html",function(err,data)
        {
            if(!err)
            {
                paginaErrore=data.toString();
            }
            else
            {
                paginaErrore="<h1>Pagina non trovata</h1>"
            }
        })
    }