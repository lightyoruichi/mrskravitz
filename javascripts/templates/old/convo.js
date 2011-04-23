var convoResultTemplate = '<li id="${id}">' +
'<div class="tweet_container">' +
' <div class="photo">' +
'  <img src="http://api.twitter.com/1/users/profile_image/${tweeter}?size=bigger" alt="${tweeter}"/>' +
' </div>' +
'<div class="description">' +
'  ${tweet}' +
' </div>' +
'</div>' +
'<div class="category_pointer_right"></div>' +
' <div class="photo tweetee">' +
'  <img src="http://api.twitter.com/1/users/profile_image/${tweetee}?size=bigger" alt="${tweetee}"/>' +
' </div>' +
'</li>';