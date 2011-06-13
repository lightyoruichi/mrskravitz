$(document).ready(function(){
	var markerLocation = new L.LatLng(30.294544, -97.824532);
	var marker = new L.Marker(markerLocation);
	map.addLayer(marker);
	
	marker.bindPopup("THE HOSPITAL AT WESTLAKE MEDICAL CENTER");

});