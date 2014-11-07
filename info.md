<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="A layout example that shows off a responsive product landing page.">

	<title>Just Login</title>

	<link rel="stylesheet" href="css/bootstrap.min.css" />
	<link rel="stylesheet" href="css/darkly.css" />
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/markdown-style.css" />

 </head>
 <body>

 	<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
 		<div class="container">
 			<div class="navbar-header">
 				<div class="navbar-brand" href="#">Just Login</div>
 			</div>
 		</div>
 	</nav>


	<div class="container">
		<div class="row">
			<div class="jumbotron col-sm-offset-2 col-sm-8">
				<h1>Just Login</h1>
 				<p>
 					A JavaScript library so that people can log in to your site with just their email address and you don't have to re-implement password storage.  YESSSSSS
 				</p>
			</div>
		</div>

		<div class="row">
			<div class="col-sm-6">
				<div id="email-view" class="well well-lg">
				</div>
			</div>
			<div class="col-sm-6">
				<div id="status-view">
				</div>
			</div>
		</div>
	</div>

	<script id="email-template" type="text/ractive">
		{{#if loggedIn}}
			<div class="row">
				<div class="col-sm-8">
					<p class="text-success youre-totally-logged-in">You{{apostrophe}}re totally logged in as {{authenticatedEmailAddress}}!</p>
				</div>
				<div class="col-sm-4">
					<button class="btn btn-default" on-click="logout">Logout</button>
				</div>
			</div>
		{{else}}
			<div class="row">
				<form action="#" onsubmit="return false">
					<div class="col-sm-8">
						<input type="text" class="form-control" placeholder="you@youremail.com" value="{{emailAddressInput}}" disabled="{{loggingIn}}" />
					</div>
					<div class="col-sm-4">
						<button class="btn btn-primary" on-click="login" disabled="{{loggingIn}}">
							{{#if loggingIn}}
								Check your email...
							{{else}}
								Login
							{{/if}}
						</button>
					</div>
				</form>
			</div>
		{{/if}}
	</script>

<!-- server-src/authenticated-stuff.js, views
	loaded:    0,
	badEmail:  1,
	debounced: 2,
	loggedIn:  3,
	loggedOut: 4
-->
	<script id="status-template" type="text/ractive">
		{{#if view==1}}
			<div class="panel panel-warning">
			 	<div class="panel-heading">
			 		<h3 class="panel-title">That{{apostrophe}}s not an email address!</h3>
				</div>
				<div class="panel-body">
					Just sayin{{apostrophe}}, <span class="badge">{{badEmail}}</span> doesn{{apostrophe}}t look right. Please try again.
				</div>
			</div>
		{{/if}}
		{{#if view==2}}
			<div class="panel panel-danger">
			 	<div class="panel-heading">
			 		<h3 class="panel-title">STAHP!!!</h3>
				</div>
				<div class="panel-body">
					Let{{apostrophe}}s not be spamming the server; wait {{debounceRemaining}} before sending another email.
				</div>
			</div>
		{{/if}}
		{{#if view==3}}
		<div class="panel panel-success">
			<div class="panel-heading">
				<h3 class="panel-title">OH SNAP you{{apostrophe}}re totally authenticated!</h3>
			</div>
			<div class="panel-body">
				<div class="row">
					<div class="col-sm-6">
						You can click this button to see if you{{apostrophe}}re still authenticated.
					</div>
					<div class="col-sm-6">
						<button type="button" class="btn btn-info pull-right" on-click="checkAuthentication">CLICK MEH</button>
					</div>
					<div class="col-sm-6 server-said-stuff-box">
						<p class="text-primary">Server said yes <span class="badge">{{globalNumberOfTimes}}</span> times.</p>
						<p class="text-primary">Server said yes <span class="badge">{{sessionNumberOfTimes}}</span> times during this session.</p>
					</div>
				</div>
			</div>
		</div>
		{{/if}}
		{{#if view==4}}
			<div class="panel panel-warning">
				<div class="panel-heading">
					<h3 class="panel-title">AAAAAAH you{{apostrophe}}re not logged in any more</h3>
				</div>
				<div class="panel-body">
					Don{{apostrophe}}t worry, we{{apostrophe}}ll keep your number safe.
				</div>
			</div>
		{{/if}}
	</script>

<!--
	Remember, markdown is allowed to have HTML inside it.
	All of the above is HTML, and basically everything below this is markdown which will be converted to HTML.
-->

#Authentication

So you're making a site where users need to be authenticated to use its cool service. And you want to use a javascript module to do the authentication stuff.

Do you really want to have passwords? [Skip passwords!](https://medium.com/@ninjudd/lets-boycott-passwords-680d97eddb01) Think about the advantages:

1. [Identities](http://blog.moertel.com/posts/2006-12-15-never-store-passwords-in-a-database.html) [won't](http://heartbleed.com/) [get](https://en.wikipedia.org/wiki/SQL_injection#Examples) [comprimised](http://readwrite.com/2009/12/16/rockyou_hacker_30_of_sites_store_plain_text_passwords) [so](http://www.net-security.org/secworld.php?id=8612) [easily.](http://en.blog.wordpress.com/2014/09/12/gmail-password-leak-update/)
2. [You don't need them](https://medium.com/@ninjudd/passwords-are-obsolete-9ed56d483eb).
3. Easier frontend. (None of those ridiculous `Registration` or `Forgot your Password` pages.)
4. You will probably get more users. (I always hate signing up for another site.)
5. Users are dumb; they'll use `123456` or reuse a password.
6. The tokens are basically impossible to guess, and expire shortly. (In this case, the token is an UUID and expires in just 5 minutes.)


#How Just-Login works without passwords

- A guy named Todd goes to a site using just-login. He types his email address into the email field and clicks `Login`.
- When the `Login` button is pressed, the core generates a unique token, and saves Todd's session id and email address under it. The core then emits an event, `'authentication initiated'`. The core will delete the token after a set time. 
- When the emailer is sees an `'authentication initiated'` event, it emails Todd, and says something like this:

```
Hey, to login, click this:
http://example.com/login?token=1234567890qwertyuiopasdfghjkl
If you didn't mean to log in, ignore this email.
```

- Todd receives the email and clicks on the link, which sends his token to the site.
- Look up the token in the user database.
- If the token is NOT there, say: "FAILURE! Maybe you waited too long, or clicked an old link."
- If the token IS there, authenticate the session id associated with the token. (It will, of course, be Todd's record.) Delete the token.
- Todd has effectively authenticated himself via his email address.
- No passwords, better security, easier to implement; what's not to like!?

#Overview of each just-login module

J.L. = Just Login

###Diagram
```
┌─────────────────┐             ┌───────┐             ┌─────────────────┐
│ Example  Server ├─────────────┤ Dnode ├─────────────┤ Example  Client │
└────────┬────────┘             └───────┘             └────────┬────────┘
┌────────┴────────┐                                     ┌──────┴──────┐
│ J.L. Server API │                                     │ J.L. Client │
└────────┬────────┘                                     └─────────────┘
 ┌───────┴──────────────────────────┐
 │         [Debounced Core]         │
 │ ┌───────────┐ ┌────────────────┐ │ ┌──────────────┐
 │ │ J.L. Core ├─┤ J.L. Debouncer │ ├─┤ J.L. Emailer │
 │ └───────────┘ └────────────────┘ │ └──────────────┘
 └───────┬──────────────────────────┘
    ┌────┴────┐
    │ LevelUP │
    └─────────┘
```


###Server Sample Code

To keep the server code clean, we will split it up into a few files.

###example-server.js
```js
//Just Login
var JlCore =      require('just-login-core')
var JlDebouncer = require('just-login-debouncer')
var JlServerApi = require('just-login-server-api')
var JlEmailerHelper = require('./example-emailer.js') //Next example file

//Other
var url = require('url')
var http = require('http')
var dnode = require('dnode')
var shoe = require('shoe')
var Static = require('node-static')
var level = require('level')

var customApi = require('./yourCustomApi.js')

//Create a few databases
var coreDb = level('./databases/core')
var debounceDb = level('./databases/debouncer')

//Set up just-login
var core = JlCore(coreDb)
justLoginDebouncer(core) //Modifies the core
JlEmailerHelper(core) //Watches for events on the core
var serverApi = JlServerApi(core)

//Set up your server
var DNODE_ENDPOINT =  "/dnode"
var TOKEN_ENDPOINT =  "/login"
var STATIC_DIR = "./static/"

//File Requests
function serve(file, req, res, code) {
	file = (file && typeof file === 'string') ? file : url.parse(req.url).pathname
	code = (code && typeof code === 'number') ? code : 200 //Status code

	fileServer.serveFile(file, code, {}, req, res).on('error', function (err) {
		if (err && (err.status === 404)) {
			fileServer.serveFile('/404.html', 404, {}, req, res)
		} else {
			res.writeHead((err && err.status) || 500, err.headers)
			res.end(err && err.message, 'utf8')
		}
	})
}

//Router
route.get('/', serve.bind(null, 'index.html'))
route.get(TOKEN_ENDPOINT, function (req, res) {
	var token = url.parse(req.url, true).query.token
	core.authenticate(token, function (err, addr) {
		if (err) { //Bad token, and other errors
			serve('loginFailure.html', req, res, 500)
		} else if (!addr) {
			serve('loginFailure.html', req, res, 400)
		} else {
			serve('loginSuccess.html', req, res)
		}
	})
})
route.get(DNODE_ENDPOINT, function () {})
route.get(CUSTOM_ENDPOINT, function () {})
route.get(serve.bind(null, ''))

//Http Server
var server = http.createServer(route)

shoe(function (stream) { //Basic authentication api
	var d = dnode(serverApi)
	d.pipe(stream).pipe(d)
}).install(server, DNODE_ENDPOINT)

shoe(function (stream) { //Custom api, (whatever api you implement want here)
	var d = dnode(customApi)
	d.pipe(stream).pipe(d)
}).install(server, CUSTOM_ENDPOINT)

server.listen(8080)
```


###example-emailer.js
```js
var JlEmailer = require('just-login-emailer')

function htmlEmail(token) {
	return 'Click ' + ('here'.link('http://example.com/login?token=' + token)) + ' to login like a boss.'
}
var transportOptions = { //if using gmail's sending server
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: "justloginexample@gmail.com",
		pass: "whatever the password is"
	}
}

var mailOptions = {
	from: 'whomever@example.com',
	subject: 'Login Like A Boss'
}

module.exports = function JlEmailerHelper(core) {
	JlEmailer(core, htmlEmail, transportOptions, mailOptions, function (err) {
		if (err) console.error(err)
	})
}

```

##What you need for your Website

To use Just-Login, you only **need** the [Core][core]. But it makes a lot of sense to also use the [Server API][sapi].

The [`Core`][core] is an event emitter that has some functions as properties. The functions are for logging you in or out, and checking if you're logged in.

The [`Server API`][sapi] takes a core. It returns two functions, one to continue and existing session, and one to create a new one. After a session is established, it gives back function for logging you in or out, and checking if you're logged in. The difference from the core, is that a session is bound to each function given back.

The [`Debouncer`][dbnc] disallows `core.beginAuthentication()` to be called in too quick of succession.

#Sending the Token
If you plan to email the user, you might as well use the [Emailer][emlr].

If you want to use something else, you'll have to write a bit of code. See the example below:

```js
core.on('authentication initiated', function (loginRequest) {

	//replace 'sendMessage' with whatever function you have for sending a message to the user.
	sendMessage(loginRequest.contactAddress, 'Here is your login code:\n' + loginRequest.token)
})
```


[core]: https://github.com/coding-in-the-wild/just-login-core
[dbnc]: https://github.com/coding-in-the-wild/just-login-debouncer
[sapi]: https://github.com/coding-in-the-wild/just-login-server-api
[clnt]: https://github.com/coding-in-the-wild/just-login-client
[emlr]: https://github.com/coding-in-the-wild/just-login-emailer
[dnode]: https://github.com/substack/dnode
[level]: https://github.com/rvagg/node-levelup



<!-- Well, here's the last of the HTML... -->



	<script src="build.js"></script>
 </body>
 </html>