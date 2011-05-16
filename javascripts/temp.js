$(document).ready(function(){
	
	var sender_phone = "";
	
	var anchorName = document.location.hash.substring(1);
	if (anchorName.length > 0) {
		cleaned = location.hash.replace("#!", "");
		sender_phone = base64.decode(cleaned);
		return true;
	}
	
	$('#form_container form').submit(function(){
		// get lat/lng
		// get subjects phone number
		// turn that into a hsh that can be decoded and split back into the params.
		
		// for each phone number submitted...
		// post to lolla-node server where it will send a sms with link to map with the hash to the phone numbers
		
		return false;
	});
	
});