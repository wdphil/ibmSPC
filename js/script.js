

function Onready_ProcessThis() {
	$('img#nav-open').click(function(e) { $('div.container-nav').addClass('open'); });
	$('img#nav-close').click(function(e) { $('div.container-nav').removeClass('open'); });
	var o = $('div.container-nav, .spinner');
	var menuPosition = 0;
	$(window).scroll(function() {
		FloatMenu(o, menuPosition);
	});
	$('input#chkTerms').attr('checked', 'true')
	$('.toggleshow').hide();
}

function onDeviceReadySO() { Onready_ProcessThis(); }

var google_analytics = ' var _gaq = _gaq || [];'
						 + '_gaq.push([\'_setAccount\', \'UA-18956716-1\']);'
						 + '_gaq.push([\'_trackPageview\']);'
						 + '(function() { var ga = document.createElement(\'script\'); ga.type = \'text/javascript\'; ga.async = true;'
						 + ' ga.src = (\'https:\' == document.location.protocol ? \'https://ssl\' : \'http://www\') + \'.google-analytics.com/ga.js\';'
						 + ' var s = document.getElementsByTagName(\'script\')[0]; s.parentNode.insertBefore(ga, s);})();'





Pages = {
	HomePageInit: function() {
		$('a.showhide').click(function(e) {
			e.preventDefault();
			var rel = $(this).attr('rel');
			var o = $('body').find('#' + rel);
			if (o.hasClass('on')) {
				$(o).removeClass('on');
				if (rel === 'hiddenpara') { } else { $('a.more').removeClass('on hide') }
			}
			else { $(o).addClass('on'); if (rel === 'hiddenpara') { } else { $(this).addClass('on hide') } }
		});

		$('.plus').click(function(e) {
			e.preventDefault();
			var rel = $(this).attr('rel');
			$('#popover-content2').html($('#' + rel).html());
			var topVal = 200
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) { topVal = 50 }
			$(this).worksModal({ top: topVal, closeButton: ".modal_close", modal_id: '#works-popover' })
		});
	},
	AgendaInit: function() {
		$('ul.tabs li').click(function(e) {
			e.preventDefault();
			var o = $(this).find('a');
			$('ul.tabs li').each(function() {
				if ($(this).hasClass('on')) { $(this).removeClass('on'); }
			});
			$('div.agends-tracks').each(function() {
				$(this).addClass('hide')
			});
			var rel = $(o).attr('rel');
			var odiv = $('body').find('div#' + rel);
			$(odiv).removeClass('hide');
			$(o).parent().addClass('on');
		});
		$('._trigger').click(function(e) {
			e.preventDefault();
			var c_rel = $(this).attr('rel');
			$('ul.tabs li').each(function() {
				if ($(this).hasClass('on')) { $(this).removeClass('on'); }
				var t_o = $(this).find('a');
				var t_rel = $(t_o).attr('rel');
				if(c_rel == t_rel){ $(this).addClass('on').click(); return false; }
			});				
		});
	},
	AgendaMobileInit: function() {
		$('ul.tabs li').click(function(e) {
			e.preventDefault();
			var o = $(this).find('a');
			var rel = $(o).attr('rel');
			var odiv = $('body').find('div#' + rel);

			if ($(this).hasClass('on')) { { $(this).removeClass('on'); $(odiv).addClass('hide'); return; } }

			$('ul.tabs li').each(function() { if ($(this).hasClass('on')) { $(this).removeClass('on'); } });
			$('div.agends-tracks').each(function() { $(this).addClass('hide') });
			$(odiv).removeClass('hide');
			$(o).parent().addClass('on');
		});

		$('a.track').click(function(e) {
			e.preventDefault();
			var rel = $(this).attr('rel');
			var odiv = $('body').find('div#' + rel);
			if ($(this).hasClass('on')) { { $(this).removeClass('on'); $(odiv).addClass('mobHide'); return; } }

			$('div.tracks').each(function() { $(this).addClass('mobHide') });
			$(odiv).removeClass('mobHide');
			$(this).addClass('on');
		});
	}
}

function FloatMenu(o, menuPosition) {
	var scrollAmount = $(document).scrollTop();
	var newPosition = menuPosition + scrollAmount;
	if ($(window).height() < o.height()) {
		o.css("top", menuPosition);
		/*s.css("top", menuPosition + 300);*/
	} else {
		o.stop().animate({ top: newPosition }, 1000);
	}
}

var tweetbox = function(who, what, maxtweets, startflip) {
	this.user = who;
	this.tb = what;
	this.data = null;
	this.maxtweets = maxtweets || 100;
	this.autostart = startflip || false;
	this.ShowTweets = function(data) {
		data = data.results;
		if (!data || !data.length) { return; }
		this.data = data;
		this.tb.empty();
		var base = 'http://twitter.com/#!/' + this.user + '/status/'
		for (var i = 0; i < data.length; i++) {
			var s = data[i].text;
			s = s.replace(/(https?\:\/\/[^\s\<]+)\b/gi, '<a class="link" href="$1" rel="external">$1</a>');
			s = s.replace(/\@([\w\-]+)\b/gi, '<a class="mention" href="http://twitter.com/$1" rel="external">@$1</a>');
			s = s.replace(/\#([\w]+)\b/gi, '<a class="hash" href="http://twitter.com/#!/search/%23$1" rel="external">#$1</a>');
			var d = this.GetTweetDateTime(data[i]);
			//s = '<header><h1><a href="' + base + data[i].id_str + '">' + d[0].join('.') + '</a></h1><h2>@ <a href="' + base + data[i].id_str + '">' + d[1].join('.') +			 '</a></h2></header><p>' + s + '</p>';
			//var tweet = '<li class="active" data-origin="' + base + data[i].id_str + '">' + s + '</li>';
			var tweet = '<li class="active"><a href="' + base + data[i].id_str + '">' + d[2] + ' ' + s + '</a></li>';
			this.tb.append(tweet);
		}
		if (this.autostart) { this.Start(); }
		this.tb.on('click', 'a', function(e) {
			e.preventDefault();
			// report click
			window.open($(this).attr('href'));
		});
	}
	this.GetTweetDateTime = function(tweet) {
		// IE can't parse the string into a date
		var d = new Date(tweet.created_at);
		if (isNaN(d.getTime())) {
			var a = tweet.created_at.split(' ');
			var s = [a[5], a[1], a[2], a[3], a[4]].join(' ')
			var d = new Date(s);
		}
		var fixtureMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		twitterDate = d.getDate().toString() + this.dateExt(d.getDate().toString()) + ' ';
		twitterDate += fixtureMonths[(d.getMonth()).toString()].substring(0, 3) + ' ';
		twitterDate += d.getFullYear().toString() + ' ';
		twitterDate += d.getHours().toString() + ':' + d.getHours().toString();

		return [[this.CharCount(d.getDate().toString(), 2),
			this.CharCount((d.getMonth() + 1).toString(), 2),
			d.getFullYear().toString()],
			[this.CharCount(d.getHours().toString(), 2),
			this.CharCount(d.getMinutes().toString(), 2)],
			twitterDate];
	}

	this.CharCount = function(s, requiredlength) {
		while (s.length < requiredlength) { s = '0' + s; }
		return s;
	}
	this.dateExt = function(day) {
		ext = '';
		switch (day) {
			case '1':
			case '21':
			case '31':
				ext = 'st';
				break;
			case '2':
			case '22':
				ext = 'nd';
			case '3':
			case '23':
				ext = 'rd';
			default:
				ext = 'th';
		}
		return ext
	}

	this.Start = function() {
		//if (!this.tb || !this.tb.length || !this.tb.children().length) { return; }
		var o = this;
		this.Change = setTimeout(function() { o.Next(); }, o.ChangeInterval);
		//this.tb.hover(function() { o.Stop(); }, function() { o.Start(); });
	}

	this.Stop = function() {
		clearTimeout(this.Change);
		this.Change = null;
	}
	this.Change = null;
	this.ChangeInterval = 30000;
	this.Next = function() {
		var o = this;
		if (this.tb.children(":not(.done)").length < 2) {
			this.tb.children().removeClass('done');
			this.tb.css('top', 0);
		} else {
			var c = $(this.tb.children(":not(.done)")[0]);
			c.addClass('done');
			var t = parseInt(this.tb.css('top')) || 0;
			this.tb.css('top', (t - c.height()) + 'px');
		}
		this.Change = setTimeout(function() { o.Next(); }, o.ChangeInterval);
	}
	this.Get = function() {
		if (!this.user || !this.tb || !this.tb.length) { return; }
		var o = this;
		$.jTwitter(this.user, this.maxtweets, function(data) {
			o.ShowTweets(data)
		});
	}
	this.Get();
}

$(document).ready(function() {
	var ua = navigator.userAgent;
	var IsBlackberry = ua.indexOf("BlackBerry") >= 0 ? true : false;
	if (!document.addEventListener) {
		document.attachEvent("deviceready", onDeviceReadySO, true);
	}
	else {
		document.addEventListener("deviceready", onDeviceReadySO, true);
	}

	Onready_ProcessThis();
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.text = google_analytics;
	if (!IsBlackberry) { $('body').append(script); }
	var tb = new tweetbox('SPCTWICKS', $('ul.tweetbox'), 20, false);
	tb.Start();
	Pages.HomePageInit();
	var IsMobile = false;
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) { IsMobile = true; }
	if (IsMobile) {
		Pages.AgendaMobileInit();
	} else { Pages.AgendaInit(); }

});

