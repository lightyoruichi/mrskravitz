$(document).ready(function(){
	
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
		params : function() {
			params          = {};
			params.env      = "https://github.com/steveodom/mrskravitz/raw/gh-pages/yql/infochimps.env";
			params.format   = "json";
			return params;
		},
		strong_links : function(sn) {
			$('#middle').show();
			$('h3.friends').html(kravitz.default_text.friend_waiting());
			
			params    = kravitz.infochimps.params();
			params.q  = "select * from infochimps.convo where sn='" + sn + "'";
			callbacks = {};
			callbacks.success = kravitz.infochimps.sl_callback;
			callbacks.errors = kravitz.infochimps.sl_error;
		  kravitz.utility.query(kravitz.utility.yql, params, callbacks);
		},
		sl_callback : function(data) {
			kravitz.details.qwerly_lookups();
			if(data.query == null || data.query.results == null || data.query.results.peeps == null){
				kravitz.infochimps.sl_error();
			}
			else if(typeof(callbacks.success) != 'undefined'){
				// $('#middle').show()
				$('h3.friends').html(kravitz.default_text.friend_description());
				$('#industry_note').html(kravitz.default_text.friend_jobs);
				
				if (IN.User.isAuthorized())
					kravitz.li.friends();
				else {
					$('ul.friends').addClass("no-li");
					$('#salary_chart_login').show();
				}
				
				var peeps = data.query.results.peeps;
				$.template("slTmpl", friendResultTemplate);
			  $.tmpl("slTmpl", peeps.peep).appendTo($('ul.friends'));
			}
		},
		sl_error : function() {
			$('h3.friends').html("Oy vey, there was an error retrieving results from Infochimps.<em>Please try again</em>");
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
			if(data.query == null || data.query.results == null || data.query.results.services == null){
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
	li : {
		error_total : 0,
		welcome : function() {
			$('#salary_chart_login').livequery(function() {
				$(this).hide();
			});
		},
		loggedin : function() {
			$('#salary_chart_login').livequery(function() {
				$(this).hide();
			});
			// kravitz.li.friends();
		},
		friends : function() {
			  $('ul.friends').removeClass("no-li");
				//remove class on ul.friends.
				$('ul.friends li').livequery(function(){
					$('#industry_chart').show();
					var i = 0;
					$(this).each(function(){ 
							kravitz.li.query($(this));
							i ++;
					});
				});
			
		},
		query : function(li) {
			var name = li.attr("data-name").split(" ");
			var postal = li.attr("data-postal");
			var country = li.attr("data-country").toLowerCase();
			var li = $.jStorage.get(name[0]+"-"+name[1]);
			if (!li) {
			// 				console.info(name[0]+"-"+name[1]);
								console.info("what");
			// 				IN.API.PeopleSearch()
			// 						.fields("id","first-name","last-name","industry","positions:(title)")
			// 				    .params({"first-name": name[0], "last-name": name[1], "count": 1, "country-code": country, "postal-code": postal})
			// 				    .result(function(result) { 
			// 				        // $("#search").html(JSON.stringify(result));
			// 								if (result.people.values != null) {
			// 									var person = result.people.values[0];
			// 									$.jStorage.set(name[0]+"-"+name[1],person);
			// 									kravitz.li.process(person);
			// 								}
			// 				    })
			// 						.error(kravitz.li.query_error);
			} else {
				kravitz.li.process(li);
			}
		},
		query_error : function(error) {
			kravitz.li.error_total ++;
			if (kravitz.li.error_total == 1) {
				var target = $('#industry_chart');
				target.show();
				if (error.errorCode == 0) {
					target.append("<li class='error'>Oy vey, Mrs. Kravitz has reached her daily allocation of calls to Linkedin. Try again tomorrow?</li>");
				} else {
					target.append("<li class='error'>"+ error.message + "</li>")
				}
			}
			return false;
		},
		process : function(person) {
			var ind_name = person.industry;
			var ind_id = person.industry.split(" ").join("-");
			var ind_li = $('#' + ind_id);
			if (ind_li.length) {
				var ind_cnt = ind_li.attr("data-cnt");
				ind_li.removeClass("tag_" + ind_cnt);
				ind_cnt ++;
				ind_li.addClass("tag_" + ind_cnt);
				ind_li.attr("data-cnt", ind_cnt);
				ind_li.html(ind-name + " (" + ind_cnt + ")");
			} else {
				$('#industry_chart').append("<li class='tag_1' id='"+ ind_li + "' data-cnt='1'>" + ind_name + " (1)</li>");
			}
			// kravitz.li.processed_total ++;
			// 			
			// 			var industries = kravitz.li.industries; 
			// 			if (industries[person.industry]) {
			// 				industries[person.industry] ++;
			// 			} else {
			// 				industries[person.industry] = 1;
			// 			}		
			// 			var jobs = kravitz.li.jobs; 
			// 			var job = person.positions.values[0].title;
			// 			if (jobs[job]) {
			// 				jobs[job] ++;
			// 			} else {
			// 				jobs[job] = 1;
			// 			}
			// 			console.info("total: " + kravitz.li.total + " vs " + kravitz.li.processed_total);
			// 			if (kravitz.li.total == kravitz.li.processed_total) {kravitz.li.renderer()}
		},
		// renderer : function() {
		// 			var target = $('#industry_chart');
		// 			target.show();
		// 			$.each(kravitz.li.industries, function(k, v) {
		// 				target.append("<li>" + k + " (" + v + ")" +"</li>");
		// 			});
		// 		},
		logout : function() {
			IN.User.logout();
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
				$('#results').show().attr("data-name", data.name);
				$('h2.result').hide()
				
		
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
			$('h2.result').addClass("twitter-error").html("Fail whale. Mrs. Kravitz had trouble getting that result from Twitter.<em>If the screen name is a good one, then it's likely a Fail Whale situation.</em>");
		}
	},
	details : {
		screen_name : "",
		tid : "",
		show : function(screen_name) {
			kravitz.details.clear();
			kravitz.twitter.profile(screen_name);
			kravitz.infochimps.social_networks(screen_name);
			kravitz.infochimps.strong_links(screen_name);
			kravitz.klout.topics(screen_name);
			kravitz.details.screen_name = screen_name;
			return false;
		},
		clear : function() {
			//clear old things
			$('#results').hide();
			
			topics = $('#topics').hide();
			topics.children('ul.topics').html('');
			friends = $('ul.friends');
			friends.html('');
			target = $('ul.social_icons');
			target.html("");
			
			$('#industry_note').html('');
			$('#lastfm_content, #flickr_content, #delicious_content').remove();
			// $('h6').hide();
			
			// $('h5.klout').html("0");
			// $('h5.followers').html("0");
			// $('h5.following').html("0");			
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
			if(data == null || data.query.results == null || data.query.results.items == null){	
				// target.parent().hide();
				kravitz.klout.topics_error();
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
			$('ul.topics').html("<li style='width:100%;'>There was an error getting results from Klout.</li>")
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
			// hack for jquery not handling jsonp errors well.
			if (req.success) {
				req.success(function(data, textStatus){
					return callbacks.success(data, callbacks.user_data);
				});
			} else {
				return callbacks.errors("", {});
			}

			
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
		friend_waiting : function() {
			
			$('#results').livequery(function(){
				var name = $(this).attr("data-name");
			});
			return "Mrs. Kravitz is looking at friends now.<em>She thinks one can tell a lot about a person by the company they keep.</em>" + kravitz.utility.spinner;
		},
		friend_description : function() {
			rand = Math.floor(Math.random()*3)
			ary = ["alrightniks", "bubbellahs", "extremely good looking people"]
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

