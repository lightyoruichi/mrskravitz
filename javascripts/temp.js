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
			lolla.socket.message();
			
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
			params.login = "steveodom";
			params.longUrl = longUrl;
			
			$.getJSON("http://api.bitly.com/v3/shorten", params, function(data){
							var msg = "Hey, here's a map of where I am. " + data.data.url;
							$('#message').val(msg).show();
			    });
		}
	},
	texter : {
		from: "",
		send : function() {
			// var loc = pin.getLatLng();
			params = {}
			
			// 			params.lat = loc.lat;
			// 			params.lng = loc.lng;
			// 			params.from = from;
			// 		
			var num1 = $('#num1').val();
			console.info(num1);
			if (num1.length > 0 && lolla.texter.valid_number(num1)) {
					params.To = num1;
			} else {
					// add an error to the screen.
			}
			
			params.message = $('#message').val();
			
			//validation here that at least one params.num1 ... num5 exists
		
			// url = "https://AC6f5d1ad75296c525a8fb9231b1da5e2d:f209ae5ed8af273406986d6d20bd17d0@api.twilio.com/2010-04-01/Accounts/AC6f5d1ad75296c525a8fb9231b1da5e2d/SMS/Messages"
			url = "http://lolla.cloudfoundry.com/send.json";
			$.ajax({ type: 'GET',
							 url: url,
							 data: params,
							 jsonpCallback: "_testcb",
							 dataType: 'jsonp'
						 }).success(function(data) {lolla.texter.send_callback(data)})
										.error(function(data) {lolla.texter.send_error(data)});
			
			
		},
		send_callback : function(data) {
			if(typeof(data) == null || !data || data.result == "errors"){	
				lolla.texter.send_error();
			}
			else {
				// console.info(data.response);
				$('#submit_btn').val("Map sent!");
			}
		},
		send_error : function(data) {
			// console.error(data);
			$('#submit_btn').val("Error. Try again.");	
		},
		valid_number : function(num) {
			//todo: strip the precending 1 if present
			var valid = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
			return valid.test(num)
		}
	},
	socket : {
		geoWS : "",
		connect : function() {
			geoWS = new WebSocket("ws://sockettome.cloudfoundry.com");
			geoWS.onopen = function(evt) {
			   console.info("opened:" + evt)
			};
			
			geoWS.onmessage = function(evt) {
				console.info("update: " + evt.data);
			};
			
			geoWS.onclose = function(evt) {
			   console.info("closed: " + evt);
			};
		},
		message : function() {
			var loc = pin.getLatLng();
			geoWS = lolla.socket.geoWS;
			console.info(geoWS)
			geoWS.postMessage("lat:" + loc.lat + " lng:" + loc.lng);
		}
	}
}