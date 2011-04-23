$(document).ready(function(){
	// plumly.sammy.early($);
	//render partials
	$.template("headerTmpl", headerResultTemplate);
  $.tmpl("headerTmpl", "").appendTo($('#header'));
	$.template("footerTmpl", footerResultTemplate);
  $.tmpl("footerTmpl", "").appendTo($('#footer'));

	$('#infochimps').submit(function(){
		var sn  = $('#search_box').attr('value'); 
		// $('#main ul.results').html("");
		kravitz.twitter.profile(sn);
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
		api_key : "steveodom-NQ9ITHYiLQg48FM6JEi6qLkbm69",
		strong_links : function(sn) {
			params    = "screen_name=" + sn + "&apikey=" + kravitz.infochimps.api_key;
			uri = "http://api.infochimps.com/social/network/tw/graph/strong_links"
			callbacks = {};
			callbacks.success = kravitz.infochimps.sl_callback;
			callbacks.errors = kravitz.infochimps.sl_error;	
		  kravitz.utility.query(uri, params, callbacks);
		},
		sl_callback : function(data) {
			// if (data.status == 401) {
			// 				alert("what")
			// 			}
			if(typeof(data) == null){	
				kravitz.infochimps.sl_error();
			}
			else if(typeof(callbacks.success) != 'undefined'){
				$('#results_loading').html(kravitz.default_text.linkedin_start);
				var ids = data.strong_links.slice(0,30);
				$('#results_sorted_note').html("what every");
				$.template("slTmpl", friendResultTemplate);
			  $.tmpl("slTmpl", ids).appendTo($('ul.results'));
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
				$('#results_loading').html(kravitz.default_text.qwerly_start);
				kravitz.infochimps.strong_links(data.screen_name);
			}
		},
		profile_error : function() {
			$('#results_loading').html(kravitz.default_text.twitter_404);
		}
	},
	utility : {
		query : function(uri, params, callbacks, cache) {
			params        = params        || {};
			var callbacks     = callbacks     || {};
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
			$('#search_share').hide();
			$('#results_loading').html(kravitz.default_text.initial_search).show();
			$('#main').animate({top:"10%", left:"25%"}, "fast");
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
					kravitz.twitter.profile(unescape(ary[1]));
					break;
			};
		}
	}
}


$.fn.hasScrollBar = function() {
  return this.get(0).scrollHeight > this.height();
};

