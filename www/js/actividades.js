function nuevaActividad(userOrigina, userDestino, actividad, objetivo){
	var idActividad = generarId()

  	var dateFull = fechaLatinaSinYear();

	var actData = { 
        id: idActividad,
        fecha: dateFull,
        idUserOrigen: userOrigina,
        idUserDestino: userDestino,
        tipo: actividad,
        objeto: objetivo
        //pulgardown: {
        //    default: true
        //}
    };

	var updates = {};
	updates['/actividad/' + idActividad] = actData;
	return firebase.database().ref().update(updates);
}

function generarId(){
	var uid = firebase.auth().currentUser.uid;
	var f = new Date()
    var dia = ('0'+f.getDate()).slice(-2).toString();
    var mes = ('0'+f.getMonth()).slice(-2).toString();
    var mesFinal = Number(mes) + 1;
    if (mesFinal <= 9 ){
      mesFinal = "0" + mesFinal 
    }
    var year = f.getFullYear();
    $('#fechaPesca').val(year+"-"+ mesFinal +"-"+dia);
    var fechaFull = year + "" + mesFinal + "" + dia

    var horas = ('0'+f.getHours()).slice(-2).toString();
    var minutos = ('0'+f.getMinutes()).slice(-2).toString();
    var segundos = ('0'+f.getSeconds()).slice(-2).toString();

	return id = "acti" + fechaFull + horas + minutos + segundos + uid 
}


function cargarActividades() { 
	firebase.database().ref("actividad").on("child_added", function(snapshot){
		valor = snapshot.val() 
		if (valor != true){
			//console.log(snapshot.val());
			var currentUser = firebase.auth().currentUser.uid;
			var idUsuarioOrigen = snapshot.val().idUserOrigen
			var idUsuarioDestino = snapshot.val().idUserDestino
			var tipo = snapshot.val().tipo 
			var objeto = snapshot.val().objeto
			var fecha = snapshot.val().fecha
			//console.log(idUsuarioOrigen)
			
			for ( x in amigosAceptados){ //BUSCO EN ARRAY DE AMIGOS SOLO CON ID
				var amigo = amigosAceptados[x]
				console.log(amigo)
				if (amigo != "default") { 

					if (idUsuarioOrigen == amigo) { // SI ID USUARIO QUE GENERA LA ACT es ID AMIGO el cual ITERO
						console.log("amigo: " + idUsuarioOrigen)

						if (tipo == "nuevapesca") {
							actAgregoPesca(idUsuarioOrigen, objeto, fecha)
						}
						if (tipo == "pulgarup" || tipo == "pulgardown" || tipo == "comentarpesca"){
							//console.log(idUsuarioOrigen, tipo)
							actLikePesca(idUsuarioOrigen, idUsuarioDestino, tipo, objeto, fecha, false)
						}
						if (tipo == "valoracionespejo" || tipo == "comentarespejo"){
							//amigoAgregoValoracion()
						}
						if (tipo == "pulgarcomentarespejo") {
							//amigoLikeValoracion()
						}
						if (tipo == "nuevoamigo") {
							//amigoNuevoAmigo()
						}		

					} else {
						if (idUsuarioOrigen != currentUser) {
							if (idUsuarioDestino == currentUser) {
								if (tipo == "pulgarup" || tipo == "pulgardown" || tipo == "comentarpesca"){
									actLikePesca(idUsuarioOrigen, idUsuarioDestino, tipo, objeto, fecha, true)
								}
								if (tipo == "pulgarcomentarespejo") {
									//amigoLikeValoracion()
								}
								if (tipo == "nuevoamigo") {
									//desconocidoAmigoYo()
								}	
								
							};

						}
						
					}
				}
				
			}
			
		}	
	});

}

var code1 = '<div class="card facebook-card"><div class="card-header no-border"><div class="facebook-avatar"><img src="'
//IMAGEN USER
var code2 = '" width="34" height="34"></div><div class="facebook-name">'
//John Doe
var code3 = '</div><div class="facebook-date">'
//Monday at 3:47 PM
var code4 = '</div></div><div class="card-content"><div class="card-content-inner"><div class="icon-act"><img src="'
// IJMAGEN ACCION
var code5 = '"></img></div><div class="desc-act">' 
//John Doe add a new
var code6 = '</div><div class="clear"></div></div></div>'
var code7 = '<div class="card-footer no-border"><a href="#" class="link">Me gusta</a><a href="#" class="link">Comentar</a><a href="#" class="link">Compartir</a></div>'
var code8 = '</div>'

function actAgregoPesca(idUser, idPesca, fecha){
	var name = buscarName(idUser) //
	var imagenUser = 'img/users/default_user_small.png'
	var imagenAccion = 'img/puntoMapa60.png'
	//$("#actividades").prepend("<li class='item-content'><div class='item-inner'><div class='item-title'>" + name + " agregó una nueva pesca. "+ fecha +".</div></div></li>");
	//$("#actividades").prepend("<li class='item-content'><div class='item-inner'><div class='icon-act'><img src='img/puntoMapa60.png'></img><div class='desc-act'>" + name + " agregó una nueva pesca.</div></div></div></li>");
    $("#actividades").prepend(code1 + imagenUser + code2 + name + code3 + fecha + code4 + imagenAccion + code5 + name + " agregó una nueva pesca." + code6 + code7 + code8)
}

function actLikePesca(idUserOrigen, idUserDestino, tipo, idPesca, fecha, propio){
	console.log(propio)
	var nameOrigen = buscarName(idUserOrigen)
	var nameDestino = buscarName(idUserDestino)
	var imagenUser = 'img/users/default_user_small.png'
	var imagenAccion

	var codigo1 = "<li class='item-content'><div class='item-inner'><div class='item-title'>A "
	var codigo2 = ".</div></div></li>"
	var accion = ""
	var objetivo = ""
	if (tipo == "pulgarup"){
		accion = " le gustó "
		imagenAccion = 'img/like-icon.png'
	}
	if (tipo == "pulgardown"){
		accion = " no le gustó "
		imagenAccion = 'img/dislike-icon.png'
	}
	if (propio == true){
		objetivo = " tu captura del día "
	}
	if (propio == false){
		objetivo = " la captura de " + nameDestino + " del día "
	}

	//$("#actividades").prepend(codigo1 + nameOrigen + accion + objetivo + fecha + codigo2);
	$("#actividades").prepend(code1 + imagenUser + code2 + nameOrigen + code3 + fecha + code4 + imagenAccion + code5 + "A " + nameOrigen + accion + objetivo + fecha + code6 + code8)
}


function notificacion(actividad){
	var mensaje, titulo
	if (actividad == "pulgarup") {
		titulo = "Activadad en tu pesca"
		mensaje = "Bien, tu pesca ha sido calificada postivamente."
	}
	if (actividad == "pulgardown") {
		titulo = "Activadad en tu pesca"
		mensaje = "Ups, tu pesca ha sido calificada negativamente."
	}
	console.log(titulo +" "+ mensaje)

    myApp.addNotification({
        title: titulo,
        message: mensaje
    });

}

function fechaLatinaSinYear(){
	var f = new Date()

	var dias = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    var nombreDia = dias[f.getUTCDay()]

	var dia = ('0'+f.getDate()).slice(-2).toString();

    var mes = ('0'+f.getMonth());
    var mesFinal = Number(mes);

    var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
	var nombreMes = meses[mesFinal];
	//console.log(mesFinal + "..:.." + nombreMes)

    var year = f.getFullYear();
	
	var fechaLatina = nombreDia + " " + dia + " de " + nombreMes
	return fechaLatina
}