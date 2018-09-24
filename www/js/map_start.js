function initialize() {
	//console.log("mapa")
	var map = null;
	var latlng = new google.maps.LatLng(37.4419, -122.1419);
	var styledMapType = new google.maps.StyledMapType(
[
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757b82"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "weight": "0.01"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9ca3ab"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "weight": "0.01"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f4f1e9"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f4f1e9"
            }
        ]
    },
    {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f4f1e9"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#d7dfb8"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#d7dfb8"
            },
            {
                "visibility": "on"
            },
            {
                "lightness": "20"
            },
            {
                "weight": "0.01"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#efebe2"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "weight": "0.5"
            },
            {
                "color": "#e6e0d0"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#efebe2"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#efebe2"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f4f1e9"
            },
            {
                "lightness": "0"
            },
            {
                "gamma": "1.85"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#bed2d2"
            },
            {
                "visibility": "on"
            },
            {
                "lightness": "0"
            },
            {
                "weight": "1"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    }
],
{name: 'Sepia Map'});

	var options = {
		zoom: 6,
		center: latlng,
		//mapTypeId: google.maps.MapTypeId.HYBRID,
		disableDefaultUI: true,
		streetViewControl: false,
		zoomControl: true,
		scaleControl: true,
		mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'styled_map']
         }

	}
	var iconBase = '../img/';
        var icons = {
          lago: {
            icon: iconBase + 'sea-icon3.png'
          },
          rio: {
            icon: iconBase + 'sea-icon3.png'
          },
          mar: {
            icon: iconBase + 'sea-icon3.png'
          }
    }

	var map = new google.maps.Map(document.getElementById("map"), options);
    mapGlobal = map;
	map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');


	google.maps.event.addListener(map, "idle", function(){
		google.maps.event.trigger(map, 'resize'); 
	});

	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(function(position) {
	    var pos = {
	      lat: position.coords.latitude,
	      lng: position.coords.longitude
	    };

	    map.setCenter(pos);
	  }, function() {
	    handleLocationError(true,  map.getCenter());
	  });
	} else {
	  // Browser doesn't support Geolocation
	  handleLocationError(false,  map.getCenter());
	}


   	map.addListener('click', function(e) {
   		//console.log(e.LatLng)
  	});

    var mousedUp = false;
    map.addListener('mousedown', function(event){ 
        mousedUp = false;
        setTimeout(function(){
            if(mousedUp === false){
                addPescaAsk(event.latLng, map)        
            }
        }, 700);
    });
    map.addListener('mouseup', function(event){ 
        mousedUp = true;
    });
    map.addListener('dragstart', function(event){ 
        mousedUp = true;
    });

	firebase.database().ref("espejo").on("child_added", function(snapshot){
      var lat = Number(snapshot.val().lat)
      var lng = Number(snapshot.val().lng)
      var position = new google.maps.LatLng(lat,lng)
      var type = snapshot.val().categoria
      var titulo = snapshot.val().nombre
      var descripcion = snapshot.val().descripcion
      var ciudad = snapshot.val().ciudad
      var provincia = snapshot.val().provincia
      var pais = snapshot.val().pais
      var img = snapshot.val().img
      var ranking = snapshot.val().ranking
      var id = snapshot.val().id
      //puntoEspejo.push( 

      var marker = new google.maps.Marker({
			position: position,
			icon: icons[type].icon,
			map: map
      });
      marker.addListener('click', function() {
        	//infowindow.open(map, marker);
        	//console.log(marker)
        	openSidePanel(map, marker, titulo, descripcion, ciudad, provincia, pais, img, ranking, id);
      });


    });	
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
}

var icon = 'http://www.sabrosoweb.com.ar/images/yellow_flag.png';
var positionToZoom, mapToZoom;
function openSidePanel(map, marker, tit, desc, city, state, country, image, ranking, id){
	
	document.getElementById("sidepanelImage").style.backgroundImage = "url('../img/espejos_agua/" + image +"";
	document.getElementById("sidePanelTitle").textContent=tit;
	document.getElementById("sidepanelSubtitle1").textContent=city;
	document.getElementById("sidepanelSubtitle2").textContent=state;
	document.getElementById("sidepanelSubtitle3").textContent=country;
	document.getElementById("sidepanelText").textContent=desc;

    $("#verPescasCercanas").removeClass("ocultarElemento")
    $("#sidePanelLinks").removeClass("ocultarElemento")
    $("#rankingEspejo").removeClass("ocultarElemento")
    $("#addValoracion").removeClass("ocultarElemento")
    $("#pulgares").addClass("ocultarElemento")
    
	var rankingFinal
	if (ranking == 0) {rankingFinal = " - " }else{rankingFinal = ranking};
	document.getElementById("valoracionNro").textContent=rankingFinal;
	var valoracionWord;
	
	if (ranking == 0) {valoracionWord = "Sin valoraciones"; };
	if (ranking > 0) {valoracionWord = "Muy malo" };
	if (ranking >= 2) {valoracionWord = "Malo" };
	if (ranking >= 4) {valoracionWord = "Bueno" };
	if (ranking >= 6) {valoracionWord = "Muy bueno" };
	if (ranking >= 8) {valoracionWord = "Excelente" };
	document.getElementById("valoracionTexto").textContent=valoracionWord;
	document.getElementById("idParaPescasCercanas").textContent=id;

	myApp.openPanel('left');
	
	positionToZoom = marker.getPosition()
	mapToZoom = map
	//var position = marker.getPosition()
	//map.setCenter(position);
	//map.setZoom(11);
	var cantidadRankings = 0
	firebase.database().ref("espejo/" + id + "/rankings/").on("child_added", function(snapshot){
		if (snapshot.key != "default" ) {
			cantidadRankings =+ 1 
		};
		if (cantidadRankings == 0) {document.getElementById("valoracionCantComentarios").textContent=" ";}
		if (cantidadRankings == 1) {document.getElementById("valoracionCantComentarios").innerHTML="<a href='#' id='" + id + "' onclick='mostrarValoraciones(this)'>" + cantidadRankings + " valoración</a>";}
		if (cantidadRankings > 2) {document.getElementById("valoracionCantComentarios").innerHTML="<a href='#' id='" + id + "' onclick='mostrarValoraciones(this)'>" + cantidadRankings + " valoraciones</a>";}
		
	});	
}

function verPescasZona(){
	myApp.closePanel('left');
	var id = document.getElementById("idParaPescasCercanas").textContent
	//console.log(id)
	mapToZoom.setCenter(positionToZoom);
	mapToZoom.setZoom(11);
	
	var iconBase = '../img/';
        var icons = {
          1: {
            icon: iconBase + 'flag-icon1.png'
          },
          2: {
            icon: iconBase + 'flag-icon2.png'
          },
          3: {
            icon: iconBase + 'flag-icon3.png'
          }
    }

	firebase.database().ref("pescas").on("child_added", function(snapshot){
		var lat = snapshot.val().latitud
		var lng = snapshot.val().longitud
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

        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(lat - positionToZoom.lat());
        var dLong = rad(lng - positionToZoom.lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(lat)) * Math.cos(rad(positionToZoom.lat())) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c // returns the distance in meter
        var km = d/1000



        if (km < 20) {
            var myLatLng = {lat: lat, lng: lng}
            markersFish = new google.maps.Marker({
                position: myLatLng,
                map: mapToZoom,
                icon: icons[ranking].icon
            });

            markersFish.addListener('click', function() {
                //infowindow.open(map, marker);
                //console.log(marker)
                openSidePanelFish(map, markersFish, id, especie, metodo, peso, tamano, descripcion, fecha, hora, userid, ranking, imagen);
            }); 
        };

		
	});	

}
var idPescaClickeada, idUserPescaClickeada;
function openSidePanelFish(map, marker, fishid, especie, metodo, peso, tamano, descripcion, fecha, hora, userid, ranking, image){
    idPescaClickeada = fishid
    idUserPescaClickeada = userid

    if (image == false || image == undefined) {imagenMostrar = "fish_noimage.jpg"} else {imagenMostrar = image};

    document.getElementById("sidepanelImage").style.backgroundImage = "url('../img/pescas/" + imagenMostrar + "";
    document.getElementById("sidePanelTitle").textContent=especie;
    document.getElementById("sidepanelSubtitle1").textContent=tamano + "cm";
    document.getElementById("sidepanelSubtitle2").textContent=peso + "kg";
    document.getElementById("sidepanelSubtitle3").textContent=metodo;
    $("#pulgarDown").removeClass("pulgarClicked")
    $("#pulgarUp").removeClass("pulgarClicked")

    firebase.database().ref('/users/' + userid).once('value', function(snapshot) {
        var username = snapshot.val().name

        if (descripcion == "" || descripcion == " " ) {descripcion = "Sin descripcion."};
        document.getElementById("sidepanelText").textContent=descripcion 
        $("#sidepanelText").append("<br><br>" + "<i>Añadida el día " + fecha + " " + hora + " por <a href='#' id='" + userid + "' onClick='pescaIrUsuario(this.id)'>" + username + "</a></i>");
    });

    var cantidadPulgaresUp = 0
    var cantidadPulgaresDown = 0
    firebase.database().ref("pescas/" + fishid + "/pulgarup").on("child_added", function(snapshot){
        if (snapshot.key != "default" ) {
            cantidadPulgaresUp =+ 1 
        };
        document.getElementById("cantPulgaresUp").textContent=cantidadPulgaresUp;
    });
    firebase.database().ref("pescas/" + fishid + "/pulgardown").on("child_added", function(snapshot){
        if (snapshot.key != "default" ) {
            cantidadPulgaresDown =+ 1 
        };
        document.getElementById("cantPulgaresDown").textContent=cantidadPulgaresDown;
    });

    firebase.database().ref("pescas/" + fishid).once("value", function(snapshot){
        $('#pulgarUp').on('click', fishPulgarUp);
        $('#pulgarDown').on('click', fishPulgarDown);
        var fishUserid = snapshot.val().userid
        var currentUserid = firebase.auth().currentUser.uid;
        //console.log(fishUserid + ":" + currentUserid)
        if (fishUserid == currentUserid) {
            //console.log("te desabilito por gil")
            $('#pulgarUp').prop('onclick',null).off('click');
            $('#pulgarDown').prop('onclick',null).off('click');
        }else{
            firebase.database().ref('users/' + currentUserid + '/pulgares/' + fishid).once('value', function(snapshot) {
                var pulgarSelect = snapshot.val()
                //console.log(snapshot.val())
                if (pulgarSelect != null) {
                    if (pulgarSelect == "up") {
                        $("#pulgarUp").addClass("pulgarClicked")
                        $("#pulgarDown").removeClass("pulgarClicked")
                    }
                    if (pulgarSelect == "down") {
                        $("#pulgarDown").addClass("pulgarClicked")
                        $("#pulgarUp").removeClass("pulgarClicked")
                    }
                    $('#pulgarUp').prop('onclick',null).off('click');
                    $('#pulgarDown').prop('onclick',null).off('click');
                    //console.log("te desabilito por gil 2")
                };
            });
        }
    });

    //firebase.database().ref('/users/' + buscar).once('value').then(function(snapshot) {


    $("#verPescasCercanas").addClass("ocultarElemento")
    $("#sidePanelLinks").addClass("ocultarElemento")
    $("#rankingEspejo").addClass("ocultarElemento")
    $("#addValoracion").addClass("ocultarElemento")
    $("#pulgares").removeClass("ocultarElemento")
    
	myApp.openPanel('left');
}

function fishPulgarUp(){
    var pulgar = {}, persona = {}
    var userid = firebase.auth().currentUser.uid;
    $("#pulgarUp").addClass("pulgarClicked")
    $('#pulgarUp').prop('onclick',null).off('click');
    $('#pulgarDown').prop('onclick',null).off('click');

    pulgar[idPescaClickeada] = "up";
    firebase.database().ref('users/' + userid + "/pulgares").update(pulgar)
    persona[userid] = "true";
    firebase.database().ref('pescas/' + idPescaClickeada + "/pulgarup").update(persona)
    nuevaActividad(userid, idUserPescaClickeada, "pulgarup", idPescaClickeada)
}
function fishPulgarDown(){
    var pulgar = {}, persona = {}
    var userid = firebase.auth().currentUser.uid;
    $("#pulgarDown").addClass("pulgarClicked")
    $('#pulgarUp').prop('onclick',null).off('click');
    $('#pulgarDown').prop('onclick',null).off('click');

    pulgar[idPescaClickeada] = "down";
    firebase.database().ref('users/' + userid + "/pulgares").update(pulgar)
    persona[userid] = "true";
    firebase.database().ref('pescas/' + idPescaClickeada + "/pulgardown").update(persona)
    nuevaActividad(userid, idUserPescaClickeada, "pulgardown", idPescaClickeada)
}

var rad = function(x) {
  return x * Math.PI / 180;
};


