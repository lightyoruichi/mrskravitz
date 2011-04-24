var friendResultTemplate =  '<li class="friend" data-id="${id}" data-name="${name}" data-location="${location}">' +
'<div class="photo">' +
' <a href="http://twitter.com/${sn}">' + 
'  <img src="http://api.twitter.com/1/users/profile_image/${id}?size=bigger" alt="${sn}"/>' +
' </a>' +
'</div>' +
'</li>';