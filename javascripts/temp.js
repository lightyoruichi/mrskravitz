$(document).ready(function(){
	
	var sender_phone = "";
	
	var anchorName = document.location.hash.substring(1);
	if (anchorName.length > 0) {
		cleaned = location.hash.replace("#!", "");
		// console.info(cleaned);
		// sender_phone = base64.decode(cleaned);
		lolla.texter.from = base64.decode(cleaned);
		// console.info(sender_phone)
		// return true;
	}
	
	$('#form_container form').submit(function(){
		$('#submit_btn').val("Sending...");
		lolla.texter.send();
		return false;
	});
});

var lolla = {
	message : {
		builder : function() {
			// TODO: make this a bitly link
			var loc = pin.getLatLng();
			var params = lolla.texter.from + "_" + loc.lat + "_" + loc.lng;
			var hsh = base64.encode(params); 
			var map_url = "http://kravitz.me/map#!" + hsh; 
			lolla.bitly.shorten(map_url);
			
		},
		spinner : function() {
			var msg = "Updating with latest your latest position....";
			$('#message').val(msg).show();
		}
	},
	bitly : {
		shorten: function(longUrl) {
			params = {}
			params.apiKey = "R_98b9678f33178a73c3439cad27afc1fb";
			params.longUrl = longUrl;
			
			$.getJSON("http://api.bitly.com/v3/shorten", params, function(data){
			        console.info(data)
							var msg = "Hey, here's a map of where I am. " + data.url;
							$('#message').val(msg).show();
			    });
		}
	},
	texter : {
		from: "",
		send : function() {
			var loc = pin.getLatLng();
			params = {}
			params.lat = loc.lat;
			params.lng = loc.lng;
			params.from = from;
		
			var num1 = $('#num1').val();
		
			if (num1.length > 0 && lolla.texter.valid_number(num1)) {
				params.num1 = num1;
			} else {
				// add an error to the screen.
			}
		
			//validation here that at least one params.num1 ... num5 exists
			// TODO: this should actually post to post directly to Twilio to send the text.
			url = "http://lolla-sinatra.cloudfoundry.com/locate";
			$.ajax({ type: 'GET',
							 url: url,
							 crossDomain: true,
							 dataType: 'jsonp',
							 data: params
						 }).success(function(data) {lolla.texter.send_callback(data)})
										.error(function(data) {lolla.texter.sender_error()});
		},
		send_callback : function(data) {
			if(typeof(data) == null || !data || data.result == "errors"){	
				lolla.texter.send_error();
			}
			else {
				console.info(data);
				$('#submit_btn').val("Map sent!");
			}
		},
		send_error : function() {
			$('#submit_btn').val("Error. Try again.");	
		},
		valid_number : function(num) {
			var valid = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
			return valid.test(num)
		}
	}
}