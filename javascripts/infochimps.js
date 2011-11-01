$(document).ready(function(){
	
	var anchorName = document.location.hash.substring(1);
	if (anchorName.length > 0) {
		api_id = anchorName.replace("!", "");
	}
	
	var base_url = "http://api.infochimps.com/geo/location/infochimps/";
	var url = base_url + api_id;
	var params = {};
	params.apikey = "steveodom-NQ9ITHYiLQg48FM6JEi6qLkbm69";
	
	$.getJSON(url, params, function(data){
		// console.info(data);
		$.each(data.features, function(i, point){
			var markerLocation = new L.LatLng(point.geometry.coordinates[1], point.geometry.coordinates[0]);
			var marker = new L.Marker(markerLocation);
			map.addLayer(marker);
			var txt = "<h2 class='map'>" + point.properties.name + "</h2>";
			txt += "<p>"+ point.properties.address + " " + point.properties.city + ", "+ point.properties.state + " " + point.properties.postal_code +"</p>";
			marker.bindPopup(txt);
		});
	});
		
});

function inside_testicles() {
	alert("inside");
}