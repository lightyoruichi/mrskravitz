var friendResultTemplate =  '<li class="friend" data-id="${$item.data[0]}">' +
'<div class="photo">' +
' <a href="http://twitter.com/account/redirect_by_id?id=${$item.data[0]}">' + 
'  <img src="http://api.twitter.com/1/users/profile_image/${$item.data[0]}?size=bigger" alt="${$item.data[0]}"/>' +
' </a>' +
'</div>' +
'</li>';