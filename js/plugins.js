
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function() {
	log.history = log.history || [];   // store logs to an array for reference
	log.history.push(arguments);
	if (this.console) {
		arguments.callee = arguments.callee.caller;
		var newarr = [].slice.call(arguments);
		(typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
	}
};

// make it safe to use console.log always
(function(b) { function c() { } for (var d = "assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","), a; a = d.pop(); ) { b[a] = b[a] || c } })((function() {
	try
{ console.log(); return window.console; } catch (err) { return window.console = {}; }
})());


// place any jQuery/helper plugins in here, instead of separate, slower script files.
/*
* jTwitter 1.1.1 - Twitter API abstraction plugin for jQuery
* Copyright (c) 2009 jQuery Howto
* Licensed under the GPL license:
*   http://www.gnu.org/licenses/gpl.html
* Plugin + Author URL:
*   http://jquery-howto.blogspot.com
*/
/*(function(b) { b.extend({ jTwitter: function(d, a, c) { if (!(d == "undefined" || a == "undefined")) { if (b.isFunction(a)) { c = a; a = 5 } b.getJSON("https://api.twitter.com/1/statuses/user_timeline/" + d + ".json?count=" + a + "&callback=?", function(e) { b.isFunction(c) && c.call(this, e) }) } } }) })(jQuery);*/

/*Just to Get the Has Tag*/

(function(b) { b.extend({ jTwitter: function(d, a, c) { if (!(d == "undefined" || a == "undefined")) { if (b.isFunction(a)) { c = a; a = 5 } b.getJSON("http://search.twitter.com/search.json?q=SPCTWICKS&rpp=5&include_entities=true&with_twitter_user_id=true&result_type=mixed&callback=?", function(e) { b.isFunction(c) && c.call(this, e) }) } } }) })(jQuery);

(function($) {
	$.fn.extend({ worksModal: function(options) {
		var defaults = { top: 100, overlay: 0.5, closeButton: null, modal_id: '#works-popover' };
		var overlay = $("<div id='works_overlay'></div>");
		if ($('#works_overlay').length == 0) { $("#content-text").prepend(overlay); }
		options = $.extend(defaults, options);
		return this.each(function() {
			var o = options;
			var modal_id = o.modal_id;
			$("#works_overlay").click(function() { close_modal(modal_id) });
			$(document).on('click', o.closeButton, function(e) { e.preventDefault(); close_modal(modal_id) });
			var modal_height = $(modal_id).outerHeight();
			var modal_width = $(modal_id).outerWidth();
			$("#works_overlay").css({ "display": "block", opacity: 0 });
			$("#works_overlay").fadeTo(1000, o.overlay);
			$(modal_id).css({ "display": "block", "position": "fixed", "opacity": 0, "z-index": 11000, "left": 50 + "%", "margin-left": -(modal_width / 2) + "px", "top": o.top + "px" });
			$(modal_id).fadeTo(1000, 1);
		});
		function close_modal(modal_id) {
			$("#works_overlay").fadeOut(1000);
			$(modal_id).css({ "display": "none" });
		}
	}
	})
})(jQuery);

