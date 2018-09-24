function cargarPerfilPescas(id){
	firebase.database().ref("users/" + id + "/pescas").on("child_added", function(snapshot){
		var idPesca = snapshot.key
		var image = snapshot.val().picture

		if (image == false || image == undefined) {imagenMostrar = "fish_noimage_small.jpg"} else {imagenMostrar = image};

		if (idPesca != "default"){
			$("#pescasUserCard").append('<a href="#" id="'+ idPesca + '" onClick="irPesca(this)"><img src="img/pescas/' + imagenMostrar +'" class="thumb"></img></a>')
		}
	});	
}

function irPesca(el){
	id = el.id

	firebase.database().ref("pescas/" + id).once("value", function(snapshot){
		var lat = snapshot.val().latitud
		var lng = snapshot.val().longitud
		var positionToZoom = new google.maps.LatLng(lat,lng)
		mapGlobal.setCenter(positionToZoom);
		mapGlobal.setZoom(11);

		var id = snapshot.val().id
		var ranking = snapshot.val().ranking
        var especie = snapshot.val().especie
        var metodo = snapshot.val().metodo
        var peso = snapshot.val().peso
        var tamano = snapshot.val().tamano
        var descripcion = snapshot.val().descripcion
        var fecha = snapshot.val().fecha
        var hora = snapshot.val().hora
        var userid = snapshot.val().userid
        var imagen = snapshot.val().picture

        var iconEspecial = '../img/flag-icon3.png';

        var marker = new google.maps.Marker({
            position: positionToZoom,
            map: mapGlobal,
            icon: iconEspecial
        });

        marker.addListener('click', function() {
            //infowindow.open(map, marker);
            //console.log(marker)
            openSidePanelFish(map, marker, id, especie, metodo, peso, tamano, descripcion, fecha, hora, userid, ranking, imagen);
        }); 

        //marker.setMap(null);

        mainView.router.load({pageName: 'index'});

        $("#BIndex").addClass("active")
		$("#BPerfil").removeClass("active")
	})
	
}

function cargarPerfilAmigos(id){

	for (x in amigosAceptados){
		firebase.database().ref("users/" + amigosAceptados[x] ).once("value", function(snapshot){
			var idUsuario = snapshot.val().id
			var image = snapshot.val().picture
			var name = buscarName(idUsuario)

			if (image == false || image == undefined) {imagenMostrar = "default_user_small_otro.jpg"} else {imagenMostrar = image};
			if (idUsuario != "default"){
				$("#listaAmigosUserCard").append('<li class="amigoLista" id="'+ idUsuario + '" onClick="irOtroUsuario(this.id)"><div class="fotoAmigo"><img src="img/users/' + imagenMostrar + '" class="thumb"></img></div><div class="nameAmigo">' + name + '</div><div class="clear"></div></li>')
			}
		});
	}
}

function pescaIrUsuario(id){
	var amigoYo = firebase.auth().currentUser.uid;
	if (amigoYo == id){
		irYoUsuario()
		myApp.closePanel();
	} else {
		irOtroUsuario(id)
		myApp.closePanel();
	}
}

function irOtroUsuario(id){
	var esAmigo = false
	var esAmigoPendiente = false
	var esAmigoEspera = false

	for (x in amigosAceptados) {
    	if (id == amigosAceptados[x]) {esAmigo = true};
    }
    //console.log(amigosPendientes)
    for (x in amigosPendientes) {
    	if (id == amigosPendientes[x]) {esAmigoPendiente = true};
    }
    
    for (x in amigosEspera){
    	if (id == amigosEspera[x]) {esAmigoEspera = true};
    }

    $("#BagregarAmigo").attr({"user" : id });

    if (esAmigo == true) {
    	$("#BagregarAmigo").attr({"status" : "friend" });
    	$("#BagregarAmigo").html("Eliminar amigo")
    	$("#BagregarAmigo").removeClass("disabled")
    	$("#BenviarMensaje").removeClass("disabled")

    	$("#cardDetallesPerfilOtroUsuario").removeClass("ocultarElemento")
    	$("#cardNotasPerfilOtroUsuario").removeClass("ocultarElemento")

    	$("#pescasOtroUsuario-visible").removeClass("ocultarElemento")
    	$("#pescasOtroUsuario-novisible").addClass("ocultarElemento")
    	$("#contactosOtroUserCard-visible").removeClass("ocultarElemento")
    	$("#contactosOtroUserCard-novisible").addClass("ocultarElemento")


    } else {
    	$("#BenviarMensaje").addClass("disabled")
    	$("#BagregarAmigo").addClass("disabled")

    	$("#cardDetallesPerfilOtroUsuario").addClass("ocultarElemento")
    	$("#cardNotasPerfilOtroUsuario").addClass("ocultarElemento")

    	$("#pescasOtroUsuario-visible").addClass("ocultarElemento")
    	$("#pescasOtroUsuario-novisible").removeClass("ocultarElemento")
    	$("#contactosOtroUserCard-visible").addClass("ocultarElemento")
    	$("#contactosOtroUserCard-novisible").removeClass("ocultarElemento")
    	
    	if (esAmigoPendiente == true) { 
    		$("#BagregarAmigo").html("Esperando")
    	} 

    	if (esAmigoEspera == true) {
    		$("#BagregarAmigo").removeClass("disabled")
    		$("#BagregarAmigo").attr({"status" : "aceptar" });
    		$("#BagregarAmigo").html("Aceptar")
    	} 

    	if (esAmigoPendiente == false && esAmigoEspera == false) {
    		$("#BagregarAmigo").attr({"status" : "unfriend" });
	    	$("#BagregarAmigo").html("Agregar amigo")
	    	$("#BagregarAmigo").removeClass("disabled")
	    }
    }

	firebase.database().ref("users/" + id).once("value", function(snapshot){
		var name = snapshot.val().name
		var ciudad = snapshot.val().ciudad
		var pais = snapshot.val().pais
		var image = snapshot.val().picture

		//var nacimiento = snapshot.val().nacimiento
		//var miembroDate = snapshot.val().miembrodesde
		//var frasedeti = snapshot.val().frasedeti

		if (image == false || image == undefined) {imagenMostrar = "default_user_small_otro.jpg"} else {imagenMostrar = image};
		document.getElementById("imagenOtroPerfil").style.backgroundImage = "url('img/users/" + imagenMostrar + "";

		document.getElementById("userActiveOtro").textContent=name;
		document.getElementById("userCiudadOtro").textContent=ciudad
		document.getElementById("userPaisOtro").textContent=pais
		document.getElementById("nameOtroUserCard").textContent="Acerca de " + name;
		
		$("#BIndex").removeClass("active")
		$("#BComunidad").removeClass("active")
    	$("#BMensajes").removeClass("active")
		$("#BPerfil").removeClass("active")
		$("#BInfoUserOtro").addClass("menuProfileActive")
	    $("#BPescasUserOtro").removeClass("menuProfileActive")
	    $("#BContactUserOtro").removeClass("menuProfileActive")

	    $("#informacionOtroUsuario").removeClass("ocultarElemento")
	    $("#pescasOtroUsuario").addClass("ocultarElemento")
	    $("#contactosOtroUsuario").addClass("ocultarElemento")

	    $("#pescasOtroUserCard").empty()
		firebase.database().ref("users/" + id + "/pescas").on("child_added", function(snapshot){
			var idPesca = snapshot.key
			if (idPesca != "default"){
				$("#pescasOtroUserCard").append('<a href="#" id="'+ idPesca + '" onClick="irPesca(this)"><img src="img/pescas/fish_noimage_small.jpg" class="thumb"></img></a>')
			}
		});	
		$("#listaAmigosOtroUserCard").empty()
		var amigoYo = firebase.auth().currentUser.uid;


		firebase.database().ref("users/" + id + "/amigos").on("child_added", function(snapshot){
			var idAmigo = snapshot.key
			var image = snapshot.val().picture

			if (image == false || image == undefined) {imagenMostrar = "default_user_small_otro.jpg"} else {imagenMostrar = image};
			if (idAmigo != "default"){
				var name = buscarName(idAmigo)
				if (idAmigo == amigoYo){
					$("#listaAmigosOtroUserCard").append('<li class="amigoLista" id="'+ idAmigo + '" onClick="irYoUsuario()"><div class="fotoAmigo"><img src="img/users/' + imagenMostrar + '" class="thumb"></img></div><div class="nameAmigo">' + name + '</div><div class="clear"></div></li>')
					//$("#amigosOtroUserCard").append('<a href="#" id="'+ idAmigo + '" onClick="irYoUsuario()"><img src="img/users/' + imagenMostrar + '" class="thumb"></img></a>')
				} else {
					$("#listaAmigosOtroUserCard").append('<li class="amigoLista" id="'+ idAmigo + '" onClick="irOtroUsuario(this.id)"><div class="fotoAmigo"><img src="img/users/' + imagenMostrar + '" class="thumb"></img></div><div class="nameAmigo">' + name + '</div><div class="clear"></div></li>')
					//$("#amigosOtroUserCard").append('<a href="#" id="'+ idAmigo + '" onClick="irOtroUsuario(this.id)"><img src="img/users/' + imagenMostrar + '" class="thumb"></img></a>')
				}
			}
		});	

		BInfoUserOtro.addEventListener('click', e => { 
		    $("#BInfoUserOtro").addClass("menuProfileActive")
		    $("#BPescasUserOtro").removeClass("menuProfileActive")
		    $("#BContactUserOtro").removeClass("menuProfileActive")

		    $("#informacionOtroUsuario").removeClass("ocultarElemento")
		    $("#pescasOtroUsuario").addClass("ocultarElemento")
		    $("#contactosOtroUsuario").addClass("ocultarElemento")
		})
		BPescasUserOtro.addEventListener('click', e => { 
		    $("#BInfoUserOtro").removeClass("menuProfileActive")
		    $("#BPescasUserOtro").addClass("menuProfileActive")
		    $("#BContactUserOtro").removeClass("menuProfileActive")

		    $("#informacionOtroUsuario").addClass("ocultarElemento")
		    $("#pescasOtroUsuario").removeClass("ocultarElemento")
		    $("#contactosOtroUsuario").addClass("ocultarElemento")
		})
		BContactUserOtro.addEventListener('click', e => { 
		    $("#BInfoUserOtro").removeClass("menuProfileActive")
		    $("#BPescasUserOtro").removeClass("menuProfileActive")
		    $("#BContactUserOtro").addClass("menuProfileActive")

		    $("#informacionOtroUsuario").addClass("ocultarElemento")
		    $("#pescasOtroUsuario").addClass("ocultarElemento")
		    $("#contactosOtroUsuario").removeClass("ocultarElemento")
		})

		mainView.router.load(
			{
				pageName: 'otroPerfil',
				animatePages: true
			}
		);
		
		
	});
	
}

function irYoUsuario(){
	$("#BIndex").removeClass("active")
    $("#BComunidad").removeClass("active")
    $("#BMensajes").removeClass("active")
    $("#BPerfil").addClass("active")

    $("#BInfoUser").addClass("menuProfileActive")
    $("#BPescasUser").removeClass("menuProfileActive")
    $("#BContactUser").removeClass("menuProfileActive")

    $("#informacionUsuario").removeClass("ocultarElemento")
    $("#pescasUsuario").addClass("ocultarElemento")
    $("#contactosUsuario").addClass("ocultarElemento")


	mainView.router.back(
		{
			pageName: 'miPerfil',
			animatePages: true
		}
	);
}

$(document).ready(function() { 
	BInfoUser.addEventListener('click', e => { 
	    $("#BInfoUser").addClass("menuProfileActive")
	    $("#BPescasUser").removeClass("menuProfileActive")
	    $("#BContactUser").removeClass("menuProfileActive")

	    $("#informacionUsuario").removeClass("ocultarElemento")
	    $("#pescasUsuario").addClass("ocultarElemento")
	    $("#contactosUsuario").addClass("ocultarElemento")
	})
	BPescasUser.addEventListener('click', e => { 
	    $("#BInfoUser").removeClass("menuProfileActive")
	    $("#BPescasUser").addClass("menuProfileActive")
	    $("#BContactUser").removeClass("menuProfileActive")

	    $("#informacionUsuario").addClass("ocultarElemento")
	    $("#pescasUsuario").removeClass("ocultarElemento")
	    $("#contactosUsuario").addClass("ocultarElemento")
	})
	BContactUser.addEventListener('click', e => { 
	    $("#BInfoUser").removeClass("menuProfileActive")
	    $("#BPescasUser").removeClass("menuProfileActive")
	    $("#BContactUser").addClass("menuProfileActive")

	    $("#informacionUsuario").addClass("ocultarElemento")
	    $("#pescasUsuario").addClass("ocultarElemento")
	    $("#contactosUsuario").removeClass("ocultarElemento")
	})


	BamigosUserCard.addEventListener('click', e => { 
	    $("#BamigosUserCard").addClass("menuProfileContactoActive")
	    $("#BclubesUserCard").removeClass("menuProfileContactoActive")
	    $("#BguiasUserCard").removeClass("menuProfileContactoActive")

	    $("#amigosUserCard").removeClass("ocultarElemento")
	    $("#clubesUserCard").addClass("ocultarElemento")
	    $("#guiasUserCard").addClass("ocultarElemento")
	})
	BclubesUserCard.addEventListener('click', e => { 
	    $("#BamigosUserCard").removeClass("menuProfileContactoActive")
	    $("#BclubesUserCard").addClass("menuProfileContactoActive")
	    $("#BguiasUserCard").removeClass("menuProfileContactoActive")

	    $("#amigosUserCard").addClass("ocultarElemento")
	    $("#clubesUserCard").removeClass("ocultarElemento")
	    $("#guiasUserCard").addClass("ocultarElemento")
	})
	BguiasUserCard.addEventListener('click', e => { 
	    $("#BamigosUserCard").removeClass("menuProfileContactoActive")
	    $("#BclubesUserCard").removeClass("menuProfileContactoActive")
	    $("#BguiasUserCard").addClass("menuProfileContactoActive")

	    $("#amigosUserCard").addClass("ocultarElemento")
	    $("#clubesUserCard").addClass("ocultarElemento")
	    $("#guiasUserCard").removeClass("ocultarElemento")
	})


	BamigosOtroUserCard.addEventListener('click', e => { 
	    $("#BamigosOtroUserCard").addClass("menuProfileContactoActive")
	    $("#BclubesOtroUserCard").removeClass("menuProfileContactoActive")
	    $("#BguiasOtroUserCard").removeClass("menuProfileContactoActive")

	    $("#amigosOtroUserCard").removeClass("ocultarElemento")
	    $("#clubesOtroUserCard").addClass("ocultarElemento")
	    $("#guiasOtroUserCard").addClass("ocultarElemento")
	})
	BclubesOtroUserCard.addEventListener('click', e => { 
	    $("#BamigosOtroUserCard").removeClass("menuProfileContactoActive")
	    $("#BclubesOtroUserCard").addClass("menuProfileContactoActive")
	    $("#BguiasOtroUserCard").removeClass("menuProfileContactoActive")

	    $("#amigosOtroUserCard").addClass("ocultarElemento")
	    $("#clubesOtroUserCard").removeClass("ocultarElemento")
	    $("#guiasOtroUserCard").addClass("ocultarElemento")
	})
	BguiasOtroUserCard.addEventListener('click', e => { 
	    $("#BamigosOtroUserCard").removeClass("menuProfileContactoActive")
	    $("#BclubesOtroUserCard").removeClass("menuProfileContactoActive")
	    $("#BguiasOtroUserCard").addClass("menuProfileContactoActive")

	    $("#amigosOtroUserCard").addClass("ocultarElemento")
	    $("#clubesOtroUserCard").addClass("ocultarElemento")
	    $("#guiasOtroUserCard").removeClass("ocultarElemento")
	})













});