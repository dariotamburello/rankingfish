function addPescaAsk(latLng, map){
    myApp.confirm('¿Desea agregar una pesca aquí?', 'Agregar pesca', function () {
        
        latitudNuevaPesca = latLng.lat()
        longitudNuevaPesca = latLng.lng()
        mainView.router.loadPage('nuevaPesca.html'); 
    });
}

function cargarFormPesca(){ 
    $("#especiePesca").empty();
    var select = document.getElementById("especiePesca");
    var optionSelected = $("option:selected", this);
    firebase.database().ref("global/especies").on("child_added", function(snapshot){
      if(snapshot.val() == true){
        opt = snapshot.key
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
      }
    });  

    $("#metodoPesca").empty();
    var select2 = document.getElementById("metodoPesca");
    var optionSelected2 = $("option:selected", select2);
    firebase.database().ref("global/metodoPesca").on("child_added", function(snapshot2){
      if(snapshot2.val() == true){
          opt2 = snapshot2.key
          var el2 = document.createElement("option");
          el2.textContent = opt2;
          el2.value = opt2;
          select2.appendChild(el2);
      }
    }); 

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
    document.getElementById("posicionPesca").value = fechaFull

    var hora = ('0'+f.getHours()).slice(-2).toString();
    var minuto = ('0'+f.getMinutes()).slice(-2).toString();
    var segundos = ('0'+f.getSeconds()).slice(-2).toString();
    $('#horaPesca').val(hora+":"+ minuto);
    $('#segundosPesca').val(segundos)

    
} 

function guardarPesca(){
  var uid = firebase.auth().currentUser.uid;

  var especie = document.getElementById("especiePesca").value
  var peso = document.getElementById('pesoPesca').value
  var tamano = document.getElementById('tamanoPesca').value
  var metodo = document.getElementById('metodoPesca').value
  var fecha = document.getElementById('fechaPesca').value
  var hora = document.getElementById('horaPesca').value
  var segundos = document.getElementById('segundosPesca').value
  var descripcion = document.getElementById('descripcionPesca').value
  var fechaCompleta = document.getElementById('posicionPesca').value

  var date = Date();
  var dateFull = date.toString();

  if (tamano == null || tamano == 0 || tamano == ""){
    $("#alertaTamanoPesca").removeClass("ocultarElemento").delay(1500).queue(function(next){
      $(this).addClass("ocultarElemento");
      next();
    });
  }else{
    if (peso == null || peso == 0 || peso == ""){
      $("#alertaPesoPesca").removeClass("ocultarElemento").delay(1500).queue(function(next){
        $(this).addClass("ocultarElemento");
        next();
      });
    }else{
      //console.log(especie + peso + tamano + metodo + fecha + hora + descripcion )
      return firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) { 
        var totalPescas = snapshot.val().totalPescas;
        var nameUser = snapshot.val().name
        if (totalPescas == false){
          totalPescas = 1;
        }
        totalPescas += 1
        var idPesca = "pesca" + uid + fechaCompleta + hora + segundos
        //console.log("total: " + totalPescas)
        writePesca(idPesca, especie, peso, tamano, metodo, fecha, hora, descripcion, latitudNuevaPesca, longitudNuevaPesca, uid, nameUser, totalPescas, dateFull)
        mainView.router.back();
      });
    }
  }
}

function writePesca(idPesca, especie, peso, tamano, metodo, fecha, hora, descripcion, latitud, longitud, userid, username, totalPescas, dateFull){
    var pescaData = { //Objeto que voy a grabar en la tabla de pescas
        id: idPesca,
        especie: especie,
        peso: peso,
        tamano: tamano,
        metodo: metodo, 
        fecha: fecha,
        hora: hora,
        datefull: dateFull,
        latitud: latitud,
        longitud: longitud,
        userid: userid,
        username: username,
        descripcion: descripcion,
        picture: false,
        ranking: 1,
        rankings: {
            default: true
        },
        pulgarup: {
            default: true
        },
        pulgardown: {
            default: true
        }
    };

    var pescaEnUsuario = {};
    pescaEnUsuario[idPesca] = true;
    //console.log(pescaData);

    var updates = {};
    updates['/pescas/' + idPesca] = pescaData;

    firebase.database().ref('users/' + userid + "/pescas").update(pescaEnUsuario)

    firebase.database().ref().child('/users/' + userid).update({ totalPescas: totalPescas });//actualizo la cantidad de pescas del usuario

    nuevaActividad(userid, "false", "nuevapesca", idPesca)

    return firebase.database().ref().update(updates); // envío todos los updates a firebase

}