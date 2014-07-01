var JustLoginEmailer = require('just-login-emailer')
var Ractive = require('ractive')

module.exports = function(core) {
	var emailSendingOptions = {
		host: 'mail.fiddlebutt.com',
		auth: {
			user: 'login@fiddlebutt.com',
			pass: ''
		}
	}
	var defaultMailOptions = {
		from: 'login@fiddlebutt.com',
		replyTo: 'no-reply@fiddlebutt.com',
		subject: 'Login to this site!'
	}

	function createHtmlEmail(loginToken) {
		return new Ractive({
			el: '',
			template: Ractive.parse('<div>You should totally log in!<br />'
				+ 'Click <a href="http://somesite.com/login?secretCode={{token}}">here!</a></div>'),
			data: {
				token: loginToken
			}
		}).toHTML()
	}

	JustLoginEmailer(core, createHtmlEmail, emailSendingOptions, defaultMailOptions)
}
