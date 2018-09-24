function cargarNombreUsuarios(usuarios){  //AL INICIAR SESION
	for (x in usuarios) {
		if (usuarios[x].id != "default") {
			firebase.database().ref("users/" + usuarios[x].id ).once("value", function(snapshot){
				var id = snapshot.val().id
				var name = snapshot.val().name
				usuariosConNombre.push({id: id, name: name})
			});
		}
	}
}

function AmigosAceptadosPendientes(amigos){ //AL INICIAR SESION
	for (x in amigos) {
		if (x != "default") {
			if (amigos[x] == true) {
				amigosAceptados.push(x)
			}
			if (amigos[x] == "pendiente") {
				amigosPendientes.push(x)
			}
			if (amigos[x] == "sinAprobar") {
				amigosEspera.push(x)
			}
		}
	}
}

function buscarName(id){
	//console.log(id)
	var idYo = firebase.auth().currentUser.uid;
	var name = "No es amigo"

	if (idYo == id) { 
		return name = "Tú"
	} else {
		for (var i = usuariosConNombre.length - 1; i >= 0; i--) {
			if (usuariosConNombre[i].id == id){
				name = usuariosConNombre[i].name
			}
		}

	}
	return name
}

BagregarAmigo.addEventListener('click', e => {
	var status = $("#BagregarAmigo").attr("status")
	var user = $("#BagregarAmigo").attr("user")
	var userid = firebase.auth().currentUser.uid;

	if (status == "unfriend") {
		$("#BagregarAmigo").addClass("disabled")
		$("#BagregarAmigo").html("Esperando")

		var solicitud = {}
		var solicitud2 = {}

		solicitud[user] = "pendiente";
		firebase.database().ref('users/' + userid + "/amigos").update(solicitud)

		solicitud2[userid] = "sinAprobar";
		firebase.database().ref('users/' + user + "/amigos").update(solicitud2)
	}
	if (status == "aceptar") {
		$("#BagregarAmigo").removeClass("disabled")
		$("#BagregarAmigo").html("Eliminar amigo")
		$("#BagregarAmigo").attr({"status" : "friend" });
		$("#BenviarMensaje").removeClass("disabled")

		$("#cardDetallesPerfilOtroUsuario").removeClass("ocultarElemento")
    	$("#cardNotasPerfilOtroUsuario").removeClass("ocultarElemento")

    	$("#pescasOtroUsuario-visible").removeClass("ocultarElemento")
    	$("#pescasOtroUsuario-novisible").addClass("ocultarElemento")
    	$("#contactosOtroUserCard-visible").removeClass("ocultarElemento")
    	$("#contactosOtroUserCard-novisible").addClass("ocultarElemento")

		var solicitud = {}
		var solicitud2 = {}

		solicitud[user] = true;
		firebase.database().ref('users/' + userid + "/amigos").update(solicitud)

		solicitud2[userid] = true;
		firebase.database().ref('users/' + user + "/amigos").update(solicitud2)
	}
	if (status == "friend") {
		$("#BagregarAmigo").html("Agregar amigo")
	    $("#BagregarAmigo").removeClass("disabled")
	    $("#BagregarAmigo").attr({"status" : "unfriend" });
		$("#BenviarMensaje").addClass("disabled")

		$("#cardDetallesPerfilOtroUsuario").addClass("ocultarElemento")
    	$("#cardNotasPerfilOtroUsuario").addClass("ocultarElemento")

    	$("#pescasOtroUsuario-visible").addClass("ocultarElemento")
    	$("#pescasOtroUsuario-novisible").removeClass("ocultarElemento")
    	$("#contactosOtroUserCard-visible").addClass("ocultarElemento")
    	$("#contactosOtroUserCard-novisible").removeClass("ocultarElemento")
		
    	var solicitud = {}
		var solicitud2 = {}

		solicitud[user] = false;
		firebase.database().ref('users/' + userid + "/amigos").update(solicitud)

		solicitud2[userid] = false;
		firebase.database().ref('users/' + user + "/amigos").update(solicitud2)
	}
});
