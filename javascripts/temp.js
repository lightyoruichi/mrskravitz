$(document).ready(function(){
	var repeat = 10;
	
	$(document).everyTime(6000, function(i) {
			var d = new Date();
			$('#holder').append("<li>" + d.getTime() + "</li>");
	}, repeat);
});