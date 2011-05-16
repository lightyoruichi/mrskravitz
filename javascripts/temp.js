$(document).ready(function(){
	
	var sender_phone = "";
	
	var anchorName = document.location.hash.substring(1);
	if (anchorName.length > 0) {
		// cleaned = location.hash.replace("#!", "");
		console.info(cleaned);
		sender_phone = base64.decode(cleaned);
		// console.info(sender_phone)
		// return true;
	}
	
	$('#form_container form').submit(function(){
		// get lat/lng
		// get subjects phone number
		// turn that into a hsh that can be decoded and split back into the params.
	alert("what");	
		return false;
	});
	
});