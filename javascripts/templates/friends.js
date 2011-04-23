var friendResultTemplate =  '<li class="friend" data-id="${id}">' +
'<div class="photo">' +
' <a href="http://twitter.com/account/redirect_by_id?id=${id}">' + 
'  <img src="http://api.twitter.com/1/users/profile_image/${id}?size=bigger" alt="${id}"/>' +
' </a>' +
'</div>' +
'</li>';