var twitterResultTemplate = '<div class="photo">' +
'  <img src="http://api.twitter.com/1/users/profile_image/${id}?size=normal" alt="${name}"/>' +
'</div>' +
'<div class="description">' +
'  <h2><a href="http://twitter.com/${screen_name}" data-screen-name="${screen_name}">${name}</a>' +
'   <em>${location}</em>' +	
'	 </h2>' +
' <p>${description}</p>' +
' </div>'