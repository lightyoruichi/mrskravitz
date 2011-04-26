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
	
	$('#job_chart li').live('mouseover mouseout', function(event) {
	  var preKlass = $(this).attr("id");
	  var klass = preKlass.replace("job_", "");
		var targets = $('ul.friends li[data-job=' + klass + ']');
		if (event.type == 'mouseover') {
	    targets.hide();
	  } else {
	    targets.show();
	  }
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
				
				if (IN.User.isAuthorized()) {
					kravitz.li.friends();
			 	}	else {
					$('#salary_chart_login').show();
				}
				
				var peeps = data.query.results.peeps;
				$.template("slTmpl", friendResultTemplate);
			  $.tmpl("slTmpl", peeps.peep).appendTo($('ul.friends'));
			
				$.each(peeps.peep, function(i, peep){
					kravitz.li.render_location(peep.location);
				});
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
			kravitz.li.friends();
		},
		// loggedin : function() {
		// 			console.info("loggedin");
		// 			$('#salary_chart_login').livequery(function() {
		// 				$(this).hide();
		// 			});
		// 		},
		friends : function() {
			  // $('ul.friends').removeClass("no-li");
				//remove class on ul.friends.
				$('ul.friends li').livequery(function(){
					$('#industry_chart, #job_chart, #locations_chart').show();
					
					$('#industry_note').html(kravitz.default_text.friend_industry);
					$('#job_note').html(kravitz.default_text.friend_jobs);
					$('#locations_note').html(kravitz.default_text.friend_locations);
					
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
			var pid = li.attr("data-id");
			var li = $.jStorage.get(pid);
			if (!li) {
				IN.API.PeopleSearch()
							.fields("id","first-name","last-name","industry","positions:(title)")
					    .params({"first-name": name[0], "last-name": name[1], "count": 1, "country-code": country, "postal-code": postal})
					    .result(function(result) { 
					        // $("#search").html(JSON.stringify(result));
									if (result.people.values != null) {
										var person = result.people.values[0];
										$.jStorage.set(name[0]+"-"+name[1],person);
										kravitz.li.process(person, pid);
									}
				 			})
							.error(kravitz.li.query_error);
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
					target.append("<li class='error'>Oy vey, The daily allocation of calls to Linkedin. Linkedin allows each person and site a very limited number of searches each day. Either you or the site has hit their limit. We've requested an increase in these limits from Linkedin. Try again tomorrow?</li>");
				} else {
					target.append("<li class='error'>"+ error.message + "</li>")
				}
			}
			return false;
		},
		process : function(person, pid) {
			kravitz.li.render_industry(person, pid);
			kravitz.li.render_job(person, pid);
		},
		render_industry : function(person, pid) {
			var ind_name = person.industry;
			var ind_id = person.industry.split(" ").join("-");
			var ind_li = $('#' + ind_id);
			if (ind_li.length) {
				var ind_cnt = parseInt(ind_li.attr("data-cnt"));
				ind_li.removeClass("tag_" + ind_cnt);
				ind_cnt ++;
				ind_li.addClass("tag_" + ind_cnt);
				ind_li.attr("data-cnt", ind_cnt);
				ind_li.html(ind_name + " (" + ind_cnt + ")");
			} else {
				$('#industry_chart').append("<li class='tag_1' id='"+ ind_id + "' data-cnt='1'>" + ind_name + " (1)</li>");
				$('#tid_' + pid).attr("data-industry", ind_id);
				
			}
		},
		render_job : function(person, pid) {
			var job_name = person.positions.values[0].title;
			var job_id = job_name.split(" ").join("-");
			var job_li = $('#job_' + job_id);
			if (job_li.length) {
				var job_cnt = parseInt(job_li.attr("data-cnt"));
				job_li.removeClass("tag_" + job_cnt);
				job_cnt ++;
				job_li.addClass("tag_" + job_cnt);
				job_li.attr("data-cnt", job_cnt);
				job_li.html(job_name + " (" + job_cnt + ")");
			} else {
				$('#job_chart').append("<li class='tag_1' id='job_"+ job_id + "' data-cnt='1'>" + job_name + " (1)</li>");
				$('#tid_' + pid).attr("data-job", job_id);
			}
		},
		render_location : function(location) {
			if (location.length > 2) {
				var lid = location.replace(",", "").split(" ").join("-");
				var li = $('#location_' + lid);
				if (li.length) {
					var cnt = parseInt(li.attr("data-cnt"));
					li.removeClass("tag_" + cnt);
					cnt ++;
					li.addClass("tag_" + cnt);
					li.attr("data-cnt", cnt);
					li.html(location + " (" + cnt + ")");
				} else {
					$('#locations_chart').append("<li class='tag_1' id='location_"+ lid + "' data-cnt='1'>" + location + " (1)</li>");
				}
			}
		},
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
			
			$('#industry_note, #job_note, #job_chart, #industry_chart, #locations_chart, #locations_note').html('');
			$('#lastfm_content, #flickr_content, #delicious_content').remove();		
			// $('#share iframe, #share blockquote').remove();
			
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
		friend_industry : "...and work in industries like:",
		friend_jobs : "...who have fancy job titles like:",
		friend_locations : "...in these cities:"
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

