// Alek Westover
// Create a chat server example on socket.io

var express = require('express');
var app = express();
//var server = app.listen(3000);
var server = require('http').createServer(app).listen(3000);

app.use(express.static('public'));

console.log("server running");

var socket = require('socket.io');
var io = socket(server); // Input output

io.sockets.on('connection', newConnection);

function newConnection(socket) {
	console.log(socket.id);
	socket.on('mouse', mouseMsg);
	socket.on('key', keyMsg);
	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data);
		console.log(data);
	}
	function keyMsg(key_data) {
		socket.broadcast.emit('key', key_data);
	}
}

console.log("hello");
