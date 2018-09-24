// Initialize app
var myApp = new Framework7({

});


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    domCache: true, //enable inline pages
    animatePages: false
});

var mapGlobal;
var markersFish;
var puntoEspejo = [];

var todosUsuarios = []
var usuariosConNombre = []
//var amigosArray;

var amigosAceptados = []
var amigosPendientes = []
var amigosEspera = []

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Dispositivo listo!");
});

myApp.onPageInit('index', function (page) {
    console.log("index page init")
})


var latitudNuevaPesca;
var longitudNuevaPesca;
myApp.onPageInit('formPesca', function (page) {
    // Do something here for "about" page
    cargarFormPesca()
    $("#formPescaAceptar").click(function(){
        guardarPesca();
    }); 
})


function mostrarFormRegistrar(){
   formRegistrar.classList.remove('formOculto'); //quita la clase oculto al formulario de inicio de sesion (lo muestra)
   formLogin.classList.add('formOculto'); //agrega la clase oculto al formulario de registro
}

function mostrarFormIniciar(){
   formRegistrar.classList.add('formOculto'); //quita la clase oculto al formulario de inicio de sesion (lo muestra)
   formLogin.classList.remove('formOculto'); //agrega la clase oculto al formulario de registro
}

BIndex.addEventListener('click', e => { 
    $("#BIndex").addClass("active")
    $("#BComunidad").removeClass("active")
    $("#BMensajes").removeClass("active")
    $("#BPerfil").removeClass("active")
});
BComunidad.addEventListener('click', e => { 
    $("#BIndex").removeClass("active")
    $("#BComunidad").addClass("active")
    $("#BMensajes").removeClass("active")
    $("#BPerfil").removeClass("active")
})
BMensajes.addEventListener('click', e => { 
    $("#BIndex").removeClass("active")
    $("#BComunidad").removeClass("active")
    $("#BMensajes").addClass("active")
    $("#BPerfil").removeClass("active")
})
BPerfil.addEventListener('click', e => { 
    $("#BIndex").removeClass("active")
    $("#BComunidad").removeClass("active")
    $("#BMensajes").removeClass("active")
    $("#BPerfil").addClass("active")
})







