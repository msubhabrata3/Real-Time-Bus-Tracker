var map;
var markers = [];

function MBTABusTracker(){
    var myOptions = {
    zoom      : 14,
    center    : { lat:42.353350,lng:-71.091525},
    mapTypeId : google.maps.MapTypeId.ROADMAP
    };
    var element = document.getElementById('map');
    map = new google.maps.Map(element, myOptions);
    addMarkers();
}

async function addMarkers(){
    var locations = await getBusLocations();

    locations.forEach(function(bus){
    var marker = getMarker(bus.id);		
    if (marker){
        moveMarker(marker,bus);
    }
    else{
        addMarker(bus);			
    }
    });
}

function addMarker(bus){
    var icon = getIcon(bus);
    var marker = new google.maps.Marker({
        position: {
            lat: bus.attributes.latitude, 
            lng: bus.attributes.longitude
        },
        map: map,
        icon: icon,
        id: bus.id
    });
    markers.push(marker);
}

function getIcon(bus){
    if(bus.attributes.direction_id === 0){
        return 'red.png';
    }
    else
        return 'blue.png';
}

function getMarker(id){
    var marker = markers.find(function(item){
        return item.id === id;
    });
    return marker;
}

function moveMarker(marker,bus) {
    var icon = getIcon(bus);
    marker.setIcon(icon);

    marker.setPosition( {
        lat: bus.attributes.latitude, 
        lng: bus.attributes.longitude
    });
}

async function getBusLocations(){
    const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
    const response = await fetch(url);
    const json     = await response.json();
    return json.data;
}