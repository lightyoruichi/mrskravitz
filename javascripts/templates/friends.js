var friendResultTemplate =  '<li class="friend" data-id="${id}" data-name="${name}" data-postal="${postal}" data-country="${countrycode}" data-location="${location}" id="tid_${id}"  data-lat="${lat}" data-lng="${lng}" data-woeid="_${woeid}">' +
'<div class="photo">' +
' <a href="http://twitter.com/${sn}">' + 
'  <img src="http://api.twitter.com/1/users/profile_image/${id}?size=bigger" alt="${sn}"/>' +
' </a>' +
'</div>' +
'</li>';