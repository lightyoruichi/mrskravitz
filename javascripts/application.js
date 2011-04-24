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
		// kravitz.details.show(sn);
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
			if(data.query.results == null || data.query.results.peeps == null){
				kravitz.infochimps.sl_error();
			}
			else if(typeof(callbacks.success) != 'undefined'){
				$('#results_loading').html(kravitz.default_text.linkedin_start);
				var peeps = data.query.results.peeps;
				// $('#results_sorted_note').html("what every");
				$.template("slTmpl", friendResultTemplate);
			  $.tmpl("slTmpl", peeps.peep).appendTo($('ul.results'));
			}
		},
		sl_error : function() {
			$('#results_loading').html(kravitz.default_text.twitter_404);
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
				$('div.details_container h2').html(kravitz.default_text.qwerly_start);
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
				//kravitz.infochimps.strong_links(data.screen_name);
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
			// 			// kravitz.infochimps.trustrank(id);
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
				// target.html("<li class='empty'>we got nothing</li>")
				target.parent().hide();
			}
			else if(typeof(callbacks.success) != 'undefined'){
				var qty = data.query.count;
				if (qty == 0) {
					kravitz.infochimps.empty_results(target, "empty");
				} else {
					target.html("");
					target.siblings('h6').show();
					$.template("topicsTmpl", topicsResultTemplate);
				  $.tmpl("topicsTmpl", data.query.results.items.item).appendTo(target);
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
			// $('#search_share').hide();
			
			// $('#results_loading').html(kravitz.default_text.initial_search).show();
			$('#left').animate({marginTop:"0", marginLeft: "0", width:"460px"}, "fast");
			$('#middle').show();
		},
	},
	default_text : {
		initial_search : "Mrs. Kravitz is walking towards her window....",
		twitter_404    : "You've stumped Mrs. Kravitz. She didn't know anything.",
		qwerly_start   : "She's now seeing with whom he/she has the most Twitter interactions....",
		linkedin_start : "She's finding out where these friends work now..."
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
					$('#search_box').val(unescape(ary[1]));
					kravitz.utility.leftSearch();
					kravitz.details.show(unescape(ary[1]));
					break;
			};
		}
	}
}


$.fn.hasScrollBar = function() {
  return this.get(0).scrollHeight > this.height();
};

