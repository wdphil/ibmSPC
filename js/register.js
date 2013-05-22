/* register user details */

//var sURL = "/interface_mobileApp.asp";
var sURL = "http://www.ibmevents.co.uk/interface_mobileApp.asp";
var ua = navigator.userAgent;
var IsBlackberry = ua.indexOf("BlackBerry") >= 0 ? true : false;
$.ajaxSetup({ url: sURL, dataType: "jsonp", type: "GET" });

$(document).ready(function() {
	$('input.register').click(function(e) {
		e.preventDefault();
		registerUser.regUserDetails('form#registration')
	});
	$('input.evaluate').click(function(e) {
		e.preventDefault();
		registerUser.IsEvaluationPage = true;
		registerUser.regUserDetails('form#evaluation')
	});
	$('input.objradio[value=\'Yes\']').attr('checked', true);
	$('input#future-contact').attr('checked', true);
});


var registerUser = {
	IsEvaluationPage: false,
	sDelimeter: ',',
	regUserDetails: function(regForm) {
		var that = this;
		$('._spinner').css({ 'display': 'block' });
		$('input[type="submit"]').attr('disabled', 'disabled');
		$(regForm).find('input[required="required"], textarea[required="required"], select[required="required"]').removeClass('invalid');
		var passed = true;
		$(regForm).find('input[required="required"], textarea[required="required"], select[required="required"]').each(function() {
			if ($(this).val() == '') { $(this).addClass('invalid'); passed = false; };
			if ($(this).attr('type') == 'checkbox' && $(this).is(':not(:checked)')) { if (!Modernizr.input.required) { $(this).addClass('invalid'); } passed = false; };
		});
		$(regForm).find('input[type="email"]').each(function() {
			if (!that.validateEmail($(this).val())) { $(this).addClass('invalid'); passed = false; };
		});
		if (passed) { if (registerUser.IsEvaluationPage == true) { this.saveDetails_frmEvalForm(); } else { this.saveDetails(); } } else {
			$('section#user-profile').show('slow'); /*In previous form submitted is incomplete*/
			$('input[type="submit"]').removeAttr('disabled');
			$('._spinner').css({ 'display': 'none' });
		}
		return passed;
	},
	saveDetails: function() {
		var attendeetype = '';
		var oSubmission = {
			'function': 'UpdateDetails',
			'arguments': [$('#Livedirectory').val(), $('#event').val(),
					$('#email').val().toLowerCase(),
					$('#name').val(),
					$('#position').val(),
					$('#company-name').val(),
					$('#address1').val(),
					$('#address2').val(),
					$('#address3').val(),
					$('#phone').val(),
					$('#mobile').val(),
					$('#accessreq').val(),
					$('#dietreq').val(),
					$('#future-contact').is(':checked')].join(this.sDelimeter),
			'delimeter': this.sDelimeter
		};

		if (IsBlackberry) {
			var http = new XMLHttpRequest();
			var url = sURL;
			var params = 'function=UpdateDetails&arguments=[' + oSubmission.arguments + ']';
			http.open("POST", url, true);
			//Send the proper header information along with the request
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			http.setRequestHeader("Content-length", params.length);
			http.setRequestHeader("Connection", "close");
			http.onreadystatechange = function() {//Call a function when the state changes.
				if (http.readyState == 4 && http.status == 200) {
					$('._spinner').css({ 'display': 'none' });
					if (http.statusText == 'OK') { window.location = 'register-thanks.html'; }
				}
			}
			http.send(params);
		} else {
			// for others phone
			var jqxhr = $.ajax({ data: oSubmission })
			.success(function(oData) { if (oData.result == 'ok') { window.location = 'register-thanks.html'; } })
			.error(function(jqXHR, textStatus, errorThrown) { console.log(textStatus + ' : ' + errorThrown); })
			.complete(function() { $('._spinner').css({ 'display': 'none' }); });
		}
	},

	saveDetails_frmEvalForm: function() {
		var oSubmission = {
			'function': 'UpdateDetails_EvaluationSection',
			'arguments': [$('#event').val(),
					$('#email').val().toLowerCase(),
					$('#name').val(),
					$('#position').val(),
					$('#company-name').val(),
					$('#future-contact').is(':checked'), 
					$('textarea#advicefor_nextSCE').val(),
					$('textarea#programmes_for_IBM').val()].join(this.sDelimeter),
			'delimeter': this.sDelimeter
		};

		if (IsBlackberry) {
			//blackberry			
			var http = new XMLHttpRequest();
			var url = sURL;
			var params = 'function=UpdateDetails_EvaluationSection&arguments=[' + oSubmission.arguments + ']';
			http.open("POST", url, true);
			//Send the proper header information along with the request
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			http.setRequestHeader("Content-length", params.length);
			http.setRequestHeader("Connection", "close");
			http.onreadystatechange = function() {//Call a function when the state changes.
				if (http.readyState == 4 && http.status == 200) {
					if (http.statusText == 'OK') { registerUser.saveChoices(); }
				}
			}
			http.send(params);
		} else {
			var jqxhr = $.ajax({ data: oSubmission })
			.success(function(oData) {
				if (oData.result == 'ok') { registerUser.saveChoices(); }
			})
    		.error(function(jqXHR, textStatus, errorThrown) { console.log(textStatus + ' : ' + errorThrown); })
			.complete(function() { });
		}
	},

	saveChoices: function() {
		var asValues = ['', '', ''];
		var i = 0;
		$('dl.evalForm dd ul').each(function() {
			var code = $(this).attr('rel')
			$(this).find('input:checked').each(function() {
				asValues[i] = code;
				asValues[i] += "***" + $(this).attr('value');
				i++;
			});
		});

		var meetObj = $('input.objradio:checked').val();
		var oSubmission = {
			'function': 'UpdateEvaluations',
			'arguments': [
					$('#event').val(),
					$('#email').val().toLowerCase()
				].join(this.sDelimeter),
			'delimeter': ',',
			'choices': asValues.join('###')
		};

		if (IsBlackberry) {
			//blackberry			
			var http = new XMLHttpRequest();
			var url = sURL;
			var params = 'function=UpdateEvaluations&choices=' + oSubmission.choices + '&arguments=[' + oSubmission.arguments + ']';
			http.open("POST", url, true);
			//Send the proper header information along with the request
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			http.setRequestHeader("Content-length", params.length);
			http.setRequestHeader("Connection", "close");
			http.onreadystatechange = function() {//Call a function when the state changes.
				if (http.readyState == 4 && http.status == 200) {
					if (http.statusText == 'OK') { window.location = 'evaluation-thanks.html'; }
				}
			}
			http.send(params);
		} else {
			var jqxhr = $.ajax({ data: oSubmission })
			.success(function(oData) {
				if (oData.result == 'ok') {
					window.location = 'evaluation-thanks.html';
				}
			})
			.error(function(jqXHR, textStatus, errorThrown) { console.log(errorThrown); console.log(textStatus); })
			.complete(function() { $('._spinner').css({ 'display': 'none' }); });
		}


	},
	validateEmail: function(sEmail) {
		var rEmail = new RegExp("^([a-zA-Z0-9_\\-\\.\\']+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$", "gim");
		var sMatch = sEmail.match(rEmail);
		return (sMatch !== null);
	}
}



/*Notes*/

//	var ua = navigator.userAgent;
//	if (ua.indexOf("BlackBerry") >= 0) {
//		if (ua.indexOf("Version/") >= 0) { // ***User Agent in BlackBerry 6 and BlackBerry 7
//			Verposition = ua.indexOf("Version/") + 8;
//			TotLenght = ua.length;
//			document.write("Jorgesys  BB OS Version :: " + ua.substring(Verposition, Verposition + 3));
//		}
//		else {// ***User Agent in BlackBerry Device Software 4.2 to 5.0
//			var SplitUA = ua.split("/");
//			document.write("Jorgesys BB OS Version :: " + SplitUA[1].substring(0, 3));
//		}
//	}
//	}
