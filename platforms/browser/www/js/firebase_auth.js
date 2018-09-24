// Initialize Firebase
var projectId = "rankingfish-d4e52";
var apiKey = "AIzaSyAe7pwgRa-bPTJyMBpNRpiKyQVwAMiLVz4";
var messagingSenderId = "185685184096";

var config = {
	apiKey: apiKey,
	authDomain: projectId + ".firebaseapp.com",
	databaseURL: "https://" + projectId + ".firebaseio.com",
	projectId: projectId,
	storageBucket: projectId + ".appspot.com",
	messagingSenderId: messagingSenderId
};
firebase.initializeApp(config);

$(document).ready(function() { 
	return firebase.database().ref('/metada/').once('value').then(function(snapshot) {
		var appname = snapshot.val().app
		var appversion = snapshot.val().ver
		console.log("app: "+ appname + " / version: " + appversion)
	});

	var userId = firebase.auth().currentUser.uid;
	loadIndex(userId);
});


(function () {

	const txtEmail = document.getElementById('username');
	const txtPassword = document.getElementById('password');
	const txtEmail2 = document.getElementById('username2');
	const txtPassword2 = document.getElementById('password2');
	const txtPassword22 = document.getElementById('password-repeat');
	
	const btnLogin = document.getElementById('btnLogin');
	const btnSignUp = document.getElementById('btnSignUp');
	const btnLogout = document.getElementById('btnLogout');

	btnLogin.addEventListener('click', e => { // EVENTO que se dispara cuando hacen click en Iniciar sesion
		const email = txtEmail.value;
		const pass = txtPassword.value;
		const auth = firebase.auth(); // auth es un objeto de firebase

		const promise = auth.signInWithEmailAndPassword(email, pass); // llamo un metodo de firebase y le paseo el objeto con usuario y pass
		promise.catch(e => {$('#alerta1').show(); console.log(e.message); localizar();}) // el mensaje que devuelva el metodo anterior, lo muestro por consola

	});

	btnSignUp.addEventListener('click', e => { // EVENTO que se dispara cuando se quieren registrar
		const email = txtEmail2.value;
		const pass = txtPassword2.value;
		const pass2 = txtPassword22.value;

		if (pass != pass2){ // verifico que haya ingresado dos veces la misma contraseña (acá podria agregar que la pass tenga cierta complejidad)
			console.log("las contraseñas no coinciden");
			return false; // si no conciden sale de la funcion de registrar y no hace nada más
		}

		const auth = firebase.auth(); //objeto firebase

		const promise = auth.createUserWithEmailAndPassword(email, pass); // metodo de firebase para registrarse (le paso usuario y pass)
		promise
			.then (function (values){ // si la promesa sale bien, guardo los datos del usuario en la base de datos
				console.log("exito");
				var user = firebase.auth().currentUser;
				var uid, uname;
				uid = user.uid;
				uname = user.email;
				uemail = user.email;

				writeUser(uid, uname, uemail); //writeUser es un metodo que declaro más abajo, es el que guarda los datos
			})
			.catch(e => {$('#alerta2').show(); console.log(e.message)}) // si la promesa falla, muestro el error que devuelve por consola


	});

	btnLogout.addEventListener('click', e => { // EVENTO que se dispara haciendo click en SALIR (cierra sesion)
		firebase.auth().signOut();
	});

	firebase.auth().onAuthStateChanged(firebaseUser => { // EVENTO que se dispara cuando el estado de usuario pasa de logueado a no logueado
		if(firebaseUser){ // si esta logueado hace lo siguiente:
			
			$("#splashPNG").removeClass("ocultarElemento").delay(2000).queue(function(next){
				console.log("ingresando a la app...")
				$(this).addClass("ocultarElemento");
				var viewPrincipal =  document.getElementById("viewPrincipal");
				viewPrincipal.classList.remove('ocultarElemento');
			    next();
			});
			myApp.closeModal();

			var userId = firebase.auth().currentUser.uid;

			console.log("bienvenido " + userId);
			loadIndex(userId)
			//mapwraper.classList.remove('oculto'); //quita clase "oculto" que mantiene oculto el mapa
			//loginwraper.classList.add('oculto'); //esconde el formulario de inicio de sesion
			//signupwraper.classList.add('oculto'); //esconde el formulario de registro

			return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) { //consulta si en la base de datos tiene imagen o pescas
			  var image = snapshot.val().picture;
			  var src = "https://firebasestorage.googleapis.com/v0/b/rankingfish-d4e52.appspot.com/o/img%2Fdefault_user.png?alt=media&token=be59cac0-be64-4648-8a8e-766934a0d102";
			  if (image === false){ //si no tiene imagen le asigna una generica
			  	$("#profilePicture").attr("src", src);
			  };

			  var namenick = snapshot.val().name
			  var email = snapshot.val().email
			  var ciudad = snapshot.val().ciudad
			  var pais = snapshot.val().pais
			  $("#nickname").text(namenick);
			  $("#email").text(email);
			  $("#ciudad").text(ciudad);
			  $("#pais").text(pais);

			  var pescas = snapshot.val().pescas;

			  if (pescas === false){
			  	$("#poseePescas").text("Actualmente no has cargado ninguna pesca, anímate!");
			  }else{
			  	$("#poseePescas").text("Estas son las pescas que has logrado:");
			  	//console.log(pescas);
			  	var key;
			  	var codePesca = "<div id='ico-pesca'><img src='img/pez-ico.png' /><span>";
			  	var codePesca2 = "</span><div>"
			  	var codePescaListo = "";
			  	for (key in pescas) {
			  		codePescaListo = codePescaListo + codePesca + pescas[key].especie + codePesca2;
			  		//console.log(pescas[key].especie);
			  	}
			  	$("#Pescas").append(codePescaListo);
			  };

			  var amigos = snapshot.val().amigos;
			  if (amigos === 0){
			  	$("#poseeAmigos").text("Aún no posees amigos, buscalos!");
			  }else{
			  	$("#poseeAmigos").text("Estos son tus amigos:");
			  }

			});

			

		} else { // sino esta logueado hace lo siguiente
			myApp.closePanel();
			var viewPrincipal =  document.getElementById("viewPrincipal");
			viewPrincipal.classList.add('ocultarElemento');

			$("#splashPNG").removeClass("ocultarElemento").delay(2000).queue(function(next){
				console.log("ingresando a la app...")
				myApp.loginScreen();

			    next();
			});

			console.log("no logueado");
			
		}
	});
	
	// Estos metodos hacen que cambie entre un formulario y otro

	function loadIndex(userId){
		firebase.database().ref('users').on('child_added', function(snapshot) {
			var id = snapshot.key
			todosUsuarios.push({id: id})
		})

		return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) { //consulta si en la base de datos tiene imagen o pescas

			var namenick = snapshot.val().name
			var email = snapshot.val().email
			var ciudad = snapshot.val().ciudad
			var pais = snapshot.val().pais

			//console.log(todosUsuarios)
			cargarNombreUsuarios(todosUsuarios)

			amigosArray = snapshot.val().amigos
			AmigosAceptadosPendientes(amigosArray)
			
			var image = snapshot.val().picture
			if (image == false || image == undefined) {imagenMostrar = "default_user_small.png"} else {imagenMostrar = image};
			document.getElementById("imagenMiPerfil").style.backgroundImage = "url('../img/users/" + imagenMostrar + "";
			document.getElementById("userActive").textContent=namenick;
			document.getElementById("userCiudad").textContent=ciudad
			document.getElementById("userPais").textContent=pais
			
			initialize(); //para el mapa
			cargarActividades();
			cargarPerfilPescas(userId);
			//cargarPerfilNotas(userId);
			cargarPerfilAmigos(userId);

		});
	}

	function writeUser(id, name, email){ // esta es la funcion que llamé antes
		var userData = { //objeto con datos del usuario
			id: id,
		    name: name,
		    email: email,
		    groups: {
		    	default: true,
		    	admin: false,
		    	vip: false
		    },
		    picture: false,
		    totalPescas: false,
		    pescas: false,
		    preferences: 'null',
		    amigos: {
		    	default: true
		    },
		    msgunread: 0,
		    habilitar: true,
		    pulgares: {
		    	default: true
		    }
		};
		var groupsData = {
			id: true
		}
		var defaultFriend ={
			amigo: true
		}
		var defaultChat ={
			chat: false
		}
		var newPostKey = id;
		var updates = {}; // coleccion de actualizaciones

		updates['/users/' + newPostKey] = userData; //armo la ruta firebase y le asigno el objeto
		updates['/group-users/default/' + id ] = true ; 
		updates['/group-users/admin/' + id ] = false ; 
		updates['/group-users/vip/' + id ] = false ; 
		updates['/user-amigos/' + id] = defaultFriend;
		updates['/user-chat/' + id] = defaultChat;
		//updates['/conversation/' + id] = defaultChat; 

		return firebase.database().ref().update(updates); // mando todos las actualizaciones a firebase

	}

}());

/**/

