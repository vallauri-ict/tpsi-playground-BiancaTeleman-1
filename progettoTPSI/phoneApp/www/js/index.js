"use strict"
// cordova plugin add cordova-plugin-camera
    
$(document).ready(function() {
  document.addEventListener('deviceready', function() {
	let divPerizie=$("#divPerizie");
	let divLogin=$("#divLogin")
	let divCrea=$("#divCrea");
	divPerizie.hide();
	divCrea.hide();

	let _username = $("#usr")
	let _password = $("#pwd")
	let _lblErrore = $("#lblErrore")
	let btnAddPerizia=$("#btnAddPerizia");
	let calendario=$("#calendario")
	let txtLat=$("#txtLat");
	let txtLong=$("#txtLong");
	let txtArea=$("#txtDescBig");
	let txtCitta=$("#txtCitta");

	let divParentImgPhoto=$("#divParentAddImg");
	let btnAddPhotoG=$("#btnAddPhotoG");
	let btnAddPhotoS=$("#btnAddPhotoS");
	let divAddedImg;
	let txtDescImg;
	let cont=-1;
	let id;
	let k=0;
	let cloudinaryLink;
	
	 let jsonPerizia={
		"id_oper":id,
		"descrizione":txtArea.val(),
		"data":calendario.val(),
		"lat":txtLat.val(),
		"long":txtLong.val(),
		"citta":txtCitta.val(),
		"foto":[]
	}
	let vetImg=[];
	let vetDesc=[];

	let jsonImg={}
	let lblErrore2=$("#lblErrore2");
	
	lblErrore2.hide();
	let cameraOptions = {
		quality: 50,
	 // destinationType: Camera.DestinationType.FILE_URI,
		destinationType: Camera.DestinationType.DATA_URL, 
 }

	let btnNuovaPerizia=$("#btnNuovaPerizia");
    _lblErrore.hide();
	divLogin.show();

	$("#btnLogin").on("click", controllaLogin)

	
	// il submit deve partire anche senza click 
	// con il solo tasto INVIO
	$(document).on('keydown', function(event) {	
	   if (event.keyCode == 13)  
		   controllaLogin();
	});
	
	
	function controllaLogin(){
        _username.removeClass("is-invalid");
		_username.prev().removeClass("icona-rossa");  				
        _password.removeClass("is-invalid");
		_password.prev().removeClass("icona-rossa"); 

		_lblErrore.hide();		
		
        if (_username.val() == "") {
            _username.addClass("is-invalid");  
			_username.prev().addClass("icona-rossa");  
        } 
		else if (_password.val() == "") {
            _password.addClass("is-invalid"); 
			_password.prev().addClass("icona-rossa"); 
        }		
		else {
			let request = inviaRichiesta('POST', '/api/loginOperatori',  
				{ "username": _username.val(),
				  "password": _password.val() 
				}
			);
			request.fail(function(jqXHR, test_status, str_error) {
				if (jqXHR.status == 401) {  // unauthorized
					_lblErrore.text(jqXHR.responseText);
					_lblErrore.show();
				} else
					errore(jqXHR, test_status, str_error)
			});
			request.done(function(data,test_status,jqXHR) {	
				//alert(jqXHR.getResponseHeader('authorization'));
				localStorage.setItem("token",jqXHR.getResponseHeader('authorization') )
				divLogin.hide();
				divPerizie.show();
				id=data.ris;
			})			
		}
	}
	
	
	_lblErrore.children("button").on("click", function(){
		_lblErrore.hide();
	})

	btnAddPhotoG.on("click",function()
	{
		cont++;
		acquisisciFoto("btnAddPhotoG")
	})

	btnAddPhotoS.on("click",function()
	{
		cont++;
		acquisisciFoto("btnAddPhotoS")

	})

	btnNuovaPerizia.on("click",function()
	{
		divPerizie.hide();
		divCrea.show();
	})

	// console.log(navigator.Camera);
	

	function acquisisciFoto(string){
		if(string=="btnAddPhotoS")
			cameraOptions.sourceType=Camera.PictureSourceType.CAMERA
		else
			cameraOptions.sourceType=Camera.PictureSourceType.PHOTOLIBRARY 
		let request = navigator.camera.getPicture(onSuccess, onError, cameraOptions)
	}
	


    function onSuccess(imageData) {
		//console.log(imageData)
		divAddedImg=$("<div>").appendTo(divParentImgPhoto);
		divAddedImg.prop("id","addedImg-"+cont)
        let img=$("<img>").appendTo(divAddedImg)
		.prop("id","img-"+cont)
		.css({"height":80})  // width si adatta automaticamente
		.prop("src", "data:image/jpeg;base64," + imageData)
		// .prop("src", imageData)
		let br=$("<br>").appendTo(divAddedImg);
		let lbl=$("<label>").appendTo(divAddedImg);
		lbl.text("Aggiungi descrizione: ");
		txtDescImg=$("<input type='text'>").appendTo(divAddedImg);
		txtDescImg.prop("id","txtDescImg-"+cont)
		
		
		let rq = inviaRichiesta("POST", "/api/cloudinaryBase64", 
						{"image":"data:image/jpeg;base64,"+imageData})
		rq.fail(errore)
		rq.done(function(data){
			//alert("upload eseguito correttamente")
			cloudinaryLink=data.url;
			console.log(cloudinaryLink);
			img.prop("link",cloudinaryLink)
		})
		

    }
	

    function onError(err) {
		/* se l'utente usa il pulsante BACK senza scegliere nessuna foto,
		   viene richiamato onError, passandogli però code = undefined */
		if (err.code)
			notifica("Errore: " + err.code + " - " + err.message);
    }
	

   function notifica(msg){		 
        navigator.notification.alert(
		    msg,    
		    function() {},       
		    "Info",       // Titolo finestra
		    "Ok"          // pulsante di chiusura
	    );			 
	}
	
	btnAddPerizia.on("click",function()
	{
		
		
		let user;
		if(txtLat.val()=="" || txtLong.val()=="" || txtArea.val()==""||txtCitta.val()=="")
		{
			lblErrore2.show();
		}
		else
		{
			let jsonSmall={};
			console.log(id);
				lblErrore2.hide();
				jsonPerizia={
					"id_oper":id,
					"descrizione":txtArea.val(),
					"data":calendario.val(),
					"lat":txtLat.val(),
					"long":txtLong.val(),
					"citta":txtCitta.val(),
					"foto":[]
				}
				for(let i=0;i<cont+1;i++)
				{
					jsonImg={}
					let img=$("#img-"+i);
					let descImg=$("#txtDescImg-"+i);
					console.log(img.prop("link"))
					console.log(descImg.val())
					jsonImg["link"]=img.prop("link");
					jsonImg["commento"]=descImg.val();
					jsonPerizia["foto"].push(jsonImg);
					
				}
				console.log(jsonPerizia)
				let rq=inviaRichiesta("POST","/api/uploadCampi",jsonPerizia)
				
				rq.done(function(data2)
				{
					alert("Upload eseguito correttamente")
					calendario.val("");
					txtLat.val("");
					txtLong.val("");
					txtCitta.val("");
					txtArea.val("");
					divParentImgPhoto.empty();
				})
				rq.fail(errore);
		}
		
	})
  });
  
}); 