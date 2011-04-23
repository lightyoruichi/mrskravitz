var bioResultTemplate = '<li id="${person.id}">' +
'<div class="photo">' +
' <a href="" onclick="plumly.details.show(${person.id}, \'${person.screen_name}\'); return false;">' + 
'  <img src="http://api.twitter.com/1/users/profile_image/${person.id}?size=bigger" alt="${person.name}"/>' +
' </a>' +
'  <h2><a href="" onclick="plumly.details.show(${person.id}, \'${person.screen_name}\'); return false;">${person.name}</a></h2>' +
'</div>' +
'<div class="description">' +
'  <h3>${person.location}</h3>' +
' <ul class="menu">' + 
' <li class="trustrank">${person.trustrank}</li>' +
' <li class="bold"><a href="" onclick="plumly.details.show(${person.id}, \'${person.screen_name}\'); return false;">more detail <span style="font-size:14px;">&raquo;</span></a></li>' +
' </ul>' +
' </div>' +
'</li>';