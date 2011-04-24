$(document).ready(function(){
	// plumly.sammy.early($);
	//render partials
	$.template("headerTmpl", headerResultTemplate);
  $.tmpl("headerTmpl", "").appendTo($('#header'));
	// $.template("footerTmpl", footerResultTemplate);
  // $.tmpl("footerTmpl", "").appendTo($('#footer'));

	$('#infochimps').submit(function(){
		var sn  = $('#search_box').attr('value'); 
		// $('#main ul.results').html("");
		sn.replace("@", "");
		kravitz.details.show(sn);
		kravitz.hash.add("search/" + sn);
		kravitz.utility.leftSearch();
		return false;
	});
		
	// screen_name search
	var search_intro = "type a twitter username...";
	var search_box = $('#search_box');
	search_box.val(search_intro);
	
	var anchorName = document.location.hash.substring(1);
	if (anchorName.length > 0) {
		kravitz.hash.router(anchorName);
	}
	
	search_box.focus(function(){
		$(this).css({color: "#505050"});
		if($(this).val() == search_intro ){
				$(this).val("");
		} 
		return false;
	});
		
});

var kravitz = {
	infochimps : {
		// api_key : "steveodom-NQ9ITHYiLQg48FM6JEi6qLkbm69",
		params : function() {
			params          = {};
			params.env      = "https://github.com/steveodom/mrskravitz/raw/gh-pages/yql/infochimps.env";
			params.format   = "json";
			return params;
		},
		strong_links : function(sn) {
			params    = kravitz.infochimps.params();
			params.q  = "select * from infochimps.convo where sn='" + sn + "'";
			callbacks = {};
			callbacks.success = kravitz.infochimps.sl_callback;
			callbacks.errors = kravitz.infochimps.sl_error;
		  kravitz.utility.query(kravitz.utility.yql, params, callbacks);
		},
		sl_callback : function(data) {
			kravitz.details.qwerly_lookups();
			if(data.query.results == null || data.query.results.peeps == null){
				kravitz.infochimps.sl_error();
			}
			else if(typeof(callbacks.success) != 'undefined'){
				// $('#middle').show()
				$('h3.friends').html(kravitz.default_text.friend_description());
				$('#industry_note').html(kravitz.default_text.friend_jobs);
				var peeps = data.query.results.peeps;
				$.template("slTmpl", friendResultTemplate);
			  $.tmpl("slTmpl", peeps.peep).appendTo($('ul.friends'));
			}
		},
		sl_error : function() {
			$('#results_loading').html(kravitz.default_text.twitter_404);
		},
		social_networks : function(screen_name) {
			params    = kravitz.infochimps.params();
			params.q  = "select * from infochimps.qwerly where screen_name='" + screen_name + "'";
			callbacks = {};
			callbacks.success = kravitz.infochimps.social_networks_callback;
			callbacks.errors = kravitz.infochimps.social_networks_error;	
			kravitz.utility.query(kravitz.utility.yql, params, callbacks);
		},
		social_networks_callback : function(data) {
			target = $('ul.social_icons');
			if(data.query.results == null || data.query.results.services == null){
				kravitz.infochimps.social_networks_error(target, "empty");
			}
			else if(typeof(callbacks.success) != 'undefined'){
				var qty = data.query.count;
				if (qty == 0) {
					kravitz.infochimps.social_networks_error(target, "empty");
				} else {
					$.template("qwerlyTmpl", qwerlyResultTemplate);
				  $.tmpl("qwerlyTmpl", data.query.results.services.service).appendTo(target);
				}
			}
		},
		social_networks_error : function(target, data) {
			// console.error(data)
		}
	},
	twitter : {
		base_uri : "http://api.twitter.com/1/users/show.json",
		profile : function(sn) {
			params    = "screen_name=" + sn;
			callbacks = {};
			callbacks.success = kravitz.twitter.profile_callback;
			callbacks.errors = kravitz.twitter.profile_error;	
		  kravitz.utility.query(kravitz.twitter.base_uri, params, callbacks);
		},
		profile_callback : function(data) {
			if(typeof(data) == null){	
				kravitz.twitter.profile_error();
			}
			else if(typeof(callbacks.success) != 'undefined'){
				$('h2.result').html(kravitz.default_text.initial_search(data.name));
				$('#middle').show();
				$('h3.friends').html(kravitz.default_text.friend_waiting(data.name));
				
				target = $('#background div.bio');
				var followers = $('h5.followers span');
				var following = $('h5.following span');

				followers.html(kravitz.utility.spinner);
				following.html(kravitz.utility.spinner);
				target.html("");
				$.template("twTmpl", twitterResultTemplate);
			  $.tmpl("twTmpl", data).appendTo(target);
				followers.html(data.followers_count);
				following.html(data.friends_count);	
			}
		},
		profile_error : function() {
			$('#results_loading').html(kravitz.default_text.twitter_404);
		}
	},
	details : {
		screen_name : "",
		tid : "",
		show : function(screen_name) {
			kravitz.details.clear();
			kravitz.twitter.profile(screen_name);
			// kravitz.infochimps.social_networks(screen_name);
			kravitz.infochimps.strong_links(screen_name);
			kravitz.klout.topics(screen_name);
			kravitz.details.screen_name = screen_name;
			
			// kravitz.details.tid = id;
			return false;
		},
		clear : function() {
			//clear old things
			topics = $('ul.topics');
			topics.html('');
			friends = $('ul.friends');
			friends.html('');
			target = $('ul.social_icons');
			target.html("");
			$('h6').hide();			
			$('#share iframe, #share blockquote').remove();
		},
		qwerly_lookups : function() {
			valid = ["flickr", "lastfm"]
			$('ul.social_icons li').each(function(){ 
				var service = $(this).attr("data-service");
				var name 		= $(this).attr("data-sn");
				
				if (valid.indexOf(service) > -1) {
					switch (service) {
						case "flickr":
							kravitz.flickr.details(name);
							break;
						case "lastfm":
							kravitz.lastfm.details(name);
							break;
					};
				}
			});
		}
	},
	flickr : {
		details : function(sn) {
			// console.info(sn)
		}
	},
	lastfm : {
		details : function(sn) {
			params = {}
			params.format   = "json";
			params.q  = "SELECT topartists.artist FROM xml WHERE url='http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&api_key=8357e388286af7ca84200d9c80f016eb&user="+ sn +"' LIMIT 3";
			callbacks.success = kravitz.lastfm.details_callback;
			callbacks.errors = kravitz.lastfm.details_error;	
			kravitz.utility.query(kravitz.utility.yql, params, callbacks);
		},
		details_callback : function(data) {
			if(data.query.results == null || data.query.results.lfm == null){
				return false;
			}
			else if(typeof(callbacks.success) != 'undefined'){
				var qty = data.query.count;
				if (qty == 0) {
					kravitz.infochimps.social_networks_error(target, "empty");
				} else {
					$('div.details_container').append("<div id='lastfm_content'></div>");
					$('#lastfm_content').append("<h6>Listens to:</h6><ul class='bands'></ul>");
					var target = $('ul.bands');
					
					var artists = data.query.results.lfm;
					$.template("lastfmTmpl", lastfmResultTemplate);
				  $.tmpl("lastfmTmpl", artists).appendTo(target);
				}
			}
		},
		details_error : function(target, data) {

		}
	},
	klout : {
		params : function() {
			params          = {};
			params.env      = "https://github.com/steveodom/mrskravitz/raw/gh-pages/yql/klout.env";
			params.format   = "json";
			return params;
		},
		topics : function(screen_name) {
			params    = kravitz.klout.params();
			params.q  = "select * from klout.topics where screen_name='" + screen_name + "'";
			callbacks = {};
			callbacks.success = kravitz.klout.topics_callback;			
		  callbacks.errors = kravitz.klout.topics_error;	
			kravitz.utility.query(kravitz.utility.yql, params, callbacks);
			return false;
		},
		topics_callback : function(data) {
			target = $('ul.topics');
			target.parent().show();
			if(data.query.results == null || data.query.results.items == null){	
				target.parent().hide();
			}
			else if(typeof(callbacks.success) != 'undefined'){
				var qty = data.query.count;
				if (qty == 0) {
					kravitz.klout.topics_error(target, "empty");
				} else {
					yql = data.query.results.items;
					$('#klout_score').html(yql.score);
					target.html("");
					target.siblings('h6').show();
					$.template("topicsTmpl", topicsResultTemplate);
				  $.tmpl("topicsTmpl", yql.item).appendTo(target);
				}
			}
		},
		topics_error : function() {
				
		}
	},
	utility : {
		yql : "https://query.yahooapis.com/v1/public/yql",
		spinner : "<img src='images/spinner-small.gif' alt='loading...' width='14' height='14'/>",
		query : function(uri, params, callbacks, cache) {
			params        = params        || {};
			callbacks 		= callbacks     || {};
			cache         = cache         || false;
			uri           = uri;
			var req = $.ajax({ cache: cache, 
							 url: uri,
							 dataType: "jsonp",
							 data: params
			      });
			req.success(function(data, textStatus){
				return callbacks.success(data, callbacks.user_data);
			});
			// hack for jquery not handling jsonp errors well.
			return callbacks.errors("", {});
		},
		errors : function(error) {
			alert("error " + error.toString());
			return false;
		},	
		leftSearch : function() {
			$('h1.headline').hide();
			$('#title').animate({marginTop:"0", marginLeft: "0"}, "fast");
			$('h2.result').show();
			$('#results').show();
		},
	},
	default_text : {
		initial_search : function(name) {
			return "This is what Mrs. Kravitz found out about " + name + ":"
		},
		twitter_404    : "You've stumped Mrs. Kravitz. She didn't know anything.",
		qwerly_start   : "She's now seeing with whom he/she has the most Twitter interactions....",
		linkedin_start : "She's finding out where these friends work now...",
		friend_waiting : function(name) {
			return "Mrs. Kravitz is seeing who "+ name + " interacts with: <em>She thinks one can tell a lot about a person by the company they keep.</em>" + kravitz.utility.spinner;
		},
		friend_description : function() {
			rand = Math.floor(Math.random()*3)
			ary = ["n'er do wells", "malcontents", "extremely good looking people"]
			return "Interacts mostly with these " + ary[rand] + "...";
		},
		friend_jobs : "...who have fancy job titles like:"
	},
	hash : {
		add : function(params) {
			location.hash = "#!" + escape(params);
		},
		router : function(anchor) {
			cleaned = location.hash.replace("#!", "");
			ary = cleaned.split("/");
			switch (ary[0]) {
				case "search":
					sn = unescape(ary[1]).replace("@", "");
					$('#search_box').val(sn);
					kravitz.utility.leftSearch();
					kravitz.details.show(sn);
					break;
			};
		}
	}
}


$.fn.hasScrollBar = function() {
  return this.get(0).scrollHeight > this.height();
};

