$(document).ready(function(){
	var markerLocation = new L.LatLng(30.294544, -97.824532);
	var marker = new L.Marker(markerLocation);
	map.addLayer(marker);
	
	marker.bindPopup("THE HOSPITAL AT WESTLAKE MEDICAL CENTER");
	
	var anchorName = document.location.hash.substring(1);
	if (anchorName.length > 0) {
		path = anchorname;
		console.info(path);
	}
	
	var base_url = "http://api.infochimps.com/geo/location/infochimps/";
	var apikey 	 = "steveodom-NQ9ITHYiLQg48FM6JEi6qLkbm69";
	
	// $.getJSON("http://api.bitly.com/v3/shorten", params, function(data){
	// 					var msg = "Hey, here's a map of where I am. " + data.data.url;
	// 					$('#message').val(msg).show();
	// 	    });

});