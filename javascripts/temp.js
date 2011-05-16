$(document).ready(function(){
	
	var sender_phone = "";
	
	var anchorName = document.location.hash.substring(1);
	if (anchorName.length > 0) {
		cleaned = location.hash.replace("#!", "");
		console.info(cleaned);
		sender_phone = base64.decode(cleaned);
		console.info(sender_phone)
		return true;
	}
	
	$('#form_container form').submit(function(){
		// get lat/lng
		// get subjects phone number
		// turn that into a hsh that can be decoded and split back into the params.
	alert("what");	
		// for each phone number submitted...
		// post to lolla-node server where it will send a sms with link to map with the hash to the phone numbers
		var loc = pin.getLatLng();
		console.info("here")
		var str = sender_phone + "_" + loc.lat + "_" + loc.lng; 
		var hsh = base64.encode(str)
		console.info(str);
		console.info(hsh);
		return false;
	});
	
});