"use strict"
$(document).ready(function() {

    let _btnInvia = $("#btnInvia");
    let _btnLogout = $("#btnLogout");
    let _btnCreaUtente=$("#btnCreaUtente");
    let divCreaUtente=$("#divCreaUtente");
    let btnCreaUtenteNew=$("#btnCreaUtenteNew");
    let table=$("#tabMail");
    let tbody=$("#tbody");
    let btnFiltra=$("#btnFiltra");
    let divFiltra=$("#divFiltra");
    let txtFiltra=$("#txtFiltra");
    let k=0;
    
    let marcatore2;
    let linkVallauri="https://res.cloudinary.com/bianca-teleman/image/upload/v1651773452/progetto/vallauriEdificio_jts3cp.jpg"
    
    let divDesc=$("#divDesc");
    let txtModDesc=$("#txtModDesc");
    let lblId=$("#lblId");
    let lblData=$("#lblData");
    let lblCoord=$("#lblCoord");
    let lblOper=$("#lblOper");
    let lblCitta=$("#lblCitta");
    let divImg=$("#divImg");
    let btnChiudiDesc=$("#btnChiudiDesc")
    let btnModificaDesc=$("#btnModificaDesc")
    let txtDescImg;
    let mappa;
    let panel= $("#panel")
    let msg =  $("#msg") 
    let containerId=$("#container")

    divCreaUtente.hide();
    table.hide();
    divDesc.hide();
    divFiltra.hide();
    let idOper=null;
    _btnCreaUtente.on("click",function()
    {
        $("#container").hide();
        divCreaUtente.show();
        
    })

    btnCreaUtenteNew.on("click",function()
    {
        
        checkUser();
        
    })

    $("#btnCreaUtenteIndietro").on("click",function(data)
    {
        divCreaUtente.hide();
        $("#container").show();
        $("#txtCreaMailU").val("");
        $("#txtCreaUserU").val("");

    })
    $("#btnMostra").on("click",function()
    {
        tbody.empty();
        table.show();
        divFiltra.show();
        
        let request=inviaRichiesta("GET","/api/location");
        request.done(function(data)
        {
            console.log(data[0]);
            let wrapper = $("#wrapper")[0]
            // vallauri
            let position = new google.maps.LatLng(44.5557763, 7.7347183);	
            console.log(position)
            console.log(wrapper)
            let mapOptions = {
                "center":position,
                "zoom":5, 
                "mapTypeId": google.maps.MapTypeId.ROADMAP,	
            }
            mappa = new google.maps.Map(wrapper, mapOptions); 

            // Creazione di un Marcatore
            let marcatore1 = new google.maps.Marker({
                "map" : mappa,
                "position" : position,
                "animation" : google.maps.Animation.DROP,
                "zIndex" : 3,
            });

            for(let i=0;i<data.length;i++)
            {
                let tr=$("<tr>").appendTo(tbody);
                let td=$("<td>").appendTo(tr);
                td.text(data[i].citta);

                td=$("<td>").appendTo(tr);
                td.text(data[i].data);

                td=$("<td>").appendTo(tr);
                td.text(data[i].descrizione);

                let position2=new google.maps.LatLng(data[i].lat, data[i].long);
                marcatore2 = new google.maps.Marker({
                    "map" : mappa,
                    "position" : position2,
                    "animation" : google.maps.Animation.DROP,
                    "zIndex" : 3,
                });
                marcatore2.addListener("click",function(){
                    divDesc.show();
                    divImg.empty()
                    lblId.text("ID: "+data[i]._id);
                    txtModDesc.val(data[i].descrizione);
                    lblData.text("Data: "+data[i].data);
                    lblCoord.text("Coordinate: "+data[i].lat+","+data[i].long);
                    lblOper.text("ID operatore: "+data[i].id_oper);
                    lblCitta.text("Citt??: "+data[i].citta);
                    btnModificaDesc.prop("_id",data[i]._id);
                    btnModificaDesc.prop("campo","descrizione");
                    visualizzaPercorso(position,position2)
                    btnModificaDesc.on("click",modifica);
                    
                    
                    for (const item of data[i].foto) 
                    {
                        let divInterno=$("<div>").appendTo(divImg);
                        let img=$("<img>").appendTo(divInterno);
                        divInterno.css({"display":"inline-block","margin-right":"5px"})
                        img.prop("src",item.link);
                        img.addClass("imgDesc");

                        let br=$("<br>").appendTo(divInterno);
                        //br=$("<br>").appendTo(divInterno);
                        txtDescImg=$(`<input type='text' id='txt${k}'>`).appendTo(divInterno);
                        txtDescImg.css({"margin-bottom":"2px"})
                        txtDescImg.val(item.commento)
                        txtDescImg.prop("dett",data[i]);
                        br=$("<br>").appendTo(divInterno);
                        let btn=$("<button type='button' class='btn btn-secondary' style='height:30px' style='text-align:center'>").appendTo(divInterno);
                        btn.text("Modifica");
                        btn.prop("index",k)
                        btn.prop("_id",data[i]._id);
                        btn.prop("campo","commento");
                        //btn.prop("testo",txtDescImg.val());
                        btn.on("click",modifica);
                        btn.prop("imgL",item.link)
                        //btn.css({"text-align":"center","margin:auto"})
                        k++;

                    }
                    
                })
            }
        })
        
        


        
    
    })
    
    btnFiltra.on("click",function()
    {
        let rq=inviaRichiesta("POST","/api/checkUser",{"username":txtFiltra.val()})
        rq.done(function(data)
        {
            
            idOper=data.ris[0]._id
            console.log(idOper)
            let request=inviaRichiesta("GET","/api/filtra/"+idOper,);
            {
                request.done(function(data)
                {
                    tbody.empty();
                    table.show();
                    divFiltra.show();
                    console.log(data)
                    let wrapper = $("#wrapper")[0]
                    // vallauri
                    let position = new google.maps.LatLng(44.5557763, 7.7347183);	
                    console.log(position)
                    console.log(wrapper)
                    let mapOptions = {
                        "center":position,
                        "zoom":5, 
                        "mapTypeId": google.maps.MapTypeId.ROADMAP,	
                    }
                    mappa = new google.maps.Map(wrapper, mapOptions); 

                    // Creazione di un Marcatore
                    let marcatore1 = new google.maps.Marker({
                        "map" : mappa,
                        "position" : position,
                        "animation" : google.maps.Animation.DROP,
                        "zIndex" : 3,
                    });

                    for(let i=0;i<data.ris.length;i++)
                    {
                        let tr=$("<tr>").appendTo(tbody);
                        let td=$("<td>").appendTo(tr);
                        td.text(data.ris[i].citta);

                        td=$("<td>").appendTo(tr);
                        td.text(data.ris[i].data);

                        td=$("<td>").appendTo(tr);
                        td.text(data.ris[i].descrizione);

                        let position2=new google.maps.LatLng(data.ris[i].lat, data.ris[i].long);
                        marcatore2 = new google.maps.Marker({
                            "map" : mappa,
                            "position" : position2,
                            "animation" : google.maps.Animation.DROP,
                            "zIndex" : 3,
                        });
                        marcatore2.addListener("click",function(){
                            divDesc.show();
                            divImg.empty()
                            lblId.text("ID: "+data.ris[i]._id);
                            txtModDesc.val(data.ris[i].descrizione);
                            lblData.text("Data: "+data.ris[i].data);
                            lblCoord.text("Coordinate: "+data.ris[i].lat+","+data.ris[i].long);
                            lblOper.text("ID operatore: "+data.ris[i].id_oper);
                            lblCitta.text("Citt??: "+data.ris[i].citta);
                            btnModificaDesc.prop("_id",data.ris[i]._id);
                            btnModificaDesc.prop("campo","descrizione");
                            visualizzaPercorso(position,position2)
                            btnModificaDesc.on("click",modifica);
                            
                            
                            for (const item of data.ris[i].foto) 
                            {
                                let divInterno=$("<div>").appendTo(divImg);
                                divInterno.css({"display":"inline-block","margin-right":"5px"})
                                let img=$("<img>").appendTo(divInterno);
                                img.prop("src",item.link);
                                img.addClass("imgDesc");

                                let br=$("<br>").appendTo(divInterno);

                                //br=$("<br>").appendTo(divInterno);
                                txtDescImg=$(`<input type='text' id='txt${k}'>`).appendTo(divInterno);
                                txtDescImg.css({"margin-bottom":"2px"})
                                //txtDescImg.prop("id","txt"+k)
                                txtDescImg.val(item.commento)
                                txtDescImg.prop("dett",data.ris[i]);
                                br=$("<br>").appendTo(divInterno);
                                let btn=$("<button type='button' class='btn btn-secondary' style='height:30px' style='text-align:center'>").appendTo(divInterno);
                                btn.text("Modifica");
                                btn.prop("_id",data.ris[i]._id);
                                btn.prop("campo","commento");
                                btn.prop("index",k)
                                //btn.prop("testo",txtDescImg.val());
                                btn.on("click",modifica);
                                btn.prop("imgL",item.link)
                                //btn.css({"text-align":"center","margin:auto"})
                                k++;

                            }
                            
                        })
                    }
                })
            }
        })

    })

   function modifica()
   {
       let testo;
       let linkMod;
        if($(this).prop("campo")=="descrizione")
        {
            testo=txtModDesc.val();
            
        }
        else
        {
            testo=$("#txt"+($(this).prop("index"))).val();
            linkMod=$(this).prop("imgL");
        }
        
        let request=inviaRichiesta("POST","/api/modifica",
        {
            "_id":$(this).prop("_id"),
            "campo":$(this).prop("campo"),
            "testo":testo,
            "link":linkMod

        })
        request.done(function(data)
        {
            console.log("updated")
        })
        request.fail(errore);
   }
    btnChiudiDesc.on("click",function()
    {
        divDesc.hide();
    })
    
    _btnLogout.on("click", function() {
        localStorage.removeItem("token")
        window.location.href = "login.html"
    });
    
    let exist
    function checkUser()
    {
        let newUserMail=$("#txtCreaMailU").val();
        let newUserUser=$("#txtCreaUserU").val();
        let request=inviaRichiesta("POST","/api/checkUser",{"username":newUserUser});
        request.done(function(data)
        {
            console.log(data)
            if(data.ris.length==0)
            {
                let rq=inviaRichiesta("POST",'/api/creaUtente',
                {
                    "email":newUserMail,
                    "username":newUserUser
                })
                rq.done(function(data)
                {
                    console.log(data);
                })
                rq.fail(errore);
                }
            else
            {
                alert("utente gi?? esistente")
                
            }
            
        })
        request.fail(errore);
        //return exist;
    }

    function visualizzaPercorso(start,arrive)
	{
		let directionsService = new google.maps.DirectionsService();
		let percorso = {
			"origin": start,
			"destination": arrive,
			"travelMode": google.maps.TravelMode.DRIVING, // default
			"provideRouteAlternatives":true,
		}; 

		directionsService.route(percorso, function(routes,status){
			if (status == google.maps.DirectionsStatus.OK) {
				let mapOptions = {
					"center":start,
					"zoom":16,
					//"mapTypeId": google.maps.MapTypeId.HYBRID
				}
				let directionsRenderer;
				
				for(let i=0; i < routes.routes.length; i++)
				{
					let color = "rgb(127,127,127)";
					if(i == 0)
					{
						color = "blue";
					}
					let renderOptions = {
						polylineOptions: {
						strokeColor : color,
						strokeWeight : 6,
						zIndex : 100 - i
						}
					}
					directionsRenderer = new google.maps.DirectionsRenderer();
					directionsRenderer.setMap(mappa);
					directionsRenderer.setRouteIndex(i);
					directionsRenderer.setDirections(routes);
				}
				console.log(routes)

				let distanza = routes.routes[0].legs[0].distance.text;
				let tempo = routes.routes[0].legs[0].duration.text;
				msg.html("Distanza: " + distanza + "</br>Tempo di percorrenza: " + tempo);
			}
			else
			{
				alert("Percorso non valido!");
			}		   
		});
	}
    
});

