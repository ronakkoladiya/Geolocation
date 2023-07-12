var map, markers = [], getyourlocation = false, line;

// latitude and longitude
var latitude = document.getElementById('latitude');
var longitude = document.getElementById('longitude');

// start and end position
var startposition = document.getElementById('start');
var stopposition = document.getElementById('stop');

// loads the map on first render
function loadMap() {
    var mapOptions = {
       center:new google.maps.LatLng(0, 0), 
       zoom:2,
    };

    map = new google.maps.Map(document.getElementById("map"),mapOptions);

    map.addListener('click', function(e) {
        placeMarker(e.latLng, map);
        calculateDistance();
    });
}

// places markers on click
function placeMarker(position, map) {

    if (getyourlocation == true) {
        clearMarkers();
        getyourlocation = false;
    }

    if (markers.length >= 2) {
        clearMarkers();
    }

    var marker = new google.maps.Marker({
        position: position,
        map: map
    });

    latitude.value = position.lat();
    longitude.value = position.lng();

    markers.push(marker);

    startposition.innerHTML = markers[0].position;
    stopposition.innerHTML = markers[1].position;
}

// gets user's current location
function getCurrentLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {

            latitude.value = position.coords.latitude;
            longitude.value = position.coords.longitude;

            getyourlocation = true;
            showLocation();
        },showError);
    } 
    else {
        alert('Geolocation is not supported by this browser.');
    }
}

// shows and marks the location
function showLocation(){

    clearMarkers();

    var latlng = {
      lat: parseFloat(latitude.value),
      lng: parseFloat(longitude.value)
    };

    map.setCenter(latlng);
    map.setZoom(12);

    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: 'Current Location'
    })

    markers.push(marker);
}

// draws lines between two markers
function drawLine(position1, position2) {
    line = new google.maps.Polyline({
      path: [position1, position2],
      strokeColor: 'rgb(46, 157, 255)',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      map: map
    });
}

// calculates the distace of two markers in km
function calculateDistance() {
    if (markers.length >= 2) {
      var lat1 = markers[0].getPosition().lat();
      var lng1 = markers[0].getPosition().lng();
      var lat2 = markers[1].getPosition().lat();
      var lng2 = markers[1].getPosition().lng();

      var distance = getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2);
      document.getElementById('distance').innerHTML = distance.toFixed(2) + ' KM';

      drawLine(markers[0].getPosition(), markers[1].getPosition());
    }
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the Earth in kilometers
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c; // Distance in kilometers
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// cleans markers which added on onclick
function clearMarkers() {

    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }

    if (line) {
        line.setMap(null);
        line = null;
    }

    markers = [];

    startposition.innerHTML = '';
    stopposition.innerHTML = '';
    document.getElementById('distance').innerHTML = ''; 
}

// resets everything to default
function resetLocation(){
    latitude.value = '';
    longitude.value = '';
    clearMarkers();
    loadMap();
}

// error if user declines location permission
function showError(){
    alert('User Declined The Permission');
}

loadMap();