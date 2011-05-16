$(document).ready(function(){
	
	var sender_phone = "";
	
	var anchorName = document.location.hash.substring(1);
	if (anchorName.length > 0) {
		cleaned = location.hash.replace("#!", "");
		// console.info(cleaned);
		sender_phone = base64.decode(cleaned);
		// console.info(sender_phone)
		// return true;
	}
	
	$('#form_container form').submit(function(){
		$('#submit_btn').val("Sending...");
		lolla.mailer(sender_phone);
		return false;
	});
});

var lolla = {
	mailer : function(from) {
		var loc = pin.getLatLng();
		params = {}
		params.lat = loc.lat;
		params.lng = loc.lng;
		params.from = from;
		var str = "lat=39.3"
		url = "http://lolla-sinatra.cloudfoundry.com/locate?" + str + "&callback=?";
		$.getJSON(url, function(data){
			console.info("what")
		})
		// $.ajax({ cache: false, 
		// 					 type: 'GET',
		// 					 url: url,
		// 					 data: params
		// 	      }).success(function(data) {lolla.mailer_callback(data)})
		// 					.error(function(data) {lolla.mailer_error()});
	},
	mailer_callback : function(data) {
		console.info(data)
		if(typeof(data) == null || !data){	
			
		}
		else {
			
		}
	},
	mailer_error : function() {
		$('#submit_btn').val("Error. Try again.");	
	}
}