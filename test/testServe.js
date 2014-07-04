var test = require('tap').test
var Server = require('../')
var http = require('http')
var request = require('superagent')

test('server serves files', function (t) { //serving files
	var server = Server()
	server.listen(9999, function() {
		console.log("before req")
		request
			.get("localhost:9999/test.txt")
			.end(function (res) {
				t.ok(res, "got a response")
				t.equal(res.text, "it works", "it works")
				server.close(t.end.bind(t))
			})
	}).on('error', function (err) {
		t.notOk(true, "ERROR: "+err.message)
	}).on('clientError', function (exception, socket) {
		t.notOk(true, "EXCEPTION: "+exception+" ON SOCKET "+socket+"(done)")
	})
})
