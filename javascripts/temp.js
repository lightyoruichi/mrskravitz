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
		
		var num1 = $('#num1').val();
		
		if (num1.length > 0 && lolla.valid_number(num1)) {
			params.num1 = num1;
		} else {
			// add an error.
		}
		
		url = "http://lolla-sinatra.cloudfoundry.com/locate";
		$.ajax({ type: 'GET',
						 url: url,
						 crossDomain: true,
						 dataType: 'jsonp',
						 data: params
					 }).success(function(data) {lolla.mailer_callback(data)})
									.error(function(data) {lolla.mailer_error()});
	},
	mailer_callback : function(data) {
		if(typeof(data) == null || !data || data.result == "errors"){	
			lolla.mailer_error();
		}
		else {
			console.info(data);
			$('#submit_btn').val("Map sent!");
		}
	},
	mailer_error : function() {
		$('#submit_btn').val("Error. Try again.");	
	},
	valid_number : function(num) {
		var valid = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
		return valid.test(num)
	}
}