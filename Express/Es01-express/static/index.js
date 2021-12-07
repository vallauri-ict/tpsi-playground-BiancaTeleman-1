$(document).ready(function () {

    $("#btnInvia").on("click", function () {
        let request = inviaRichiesta("get", "/api/servizio1", { "name": "Minnie" }
        );
        request.fail(errore);
        request.done(function (data) {
            alert(JSON.stringify(data));
        });
    });

    $("#btnInvia2").on("click", function () {
        let request = inviaRichiesta("patch", "/api/servizio2", { "nome": "Unico", "vampires":3 }
        );
        request.fail(errore);
        request.done(function (data) {
            if(data.modifiedCount > 0){
                alert("Aggiornamento effettuato");
            }
            else{
                alert("Nessuna corrispondenza");
            }
        });
    });

    $("#btnInvia3").on("click", function () {
        let request = inviaRichiesta("get", "/api/servizio3/m/brown");
        request.fail(errore);
        request.done(function (data) {
            console.log(data);
        });
    });
});

