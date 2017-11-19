// Alek Westover
// Create a chat server example on socket.io

var express = require('express');
var app = express();

//indcredibly important line, allows heroku to run this on the correct port
var port = process.env.PORT || 3000;
var server = require('http').createServer(app).listen(port);

app.use(express.static('public'));

console.log("server running");

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
	socket.on('key', keyMsg);
	socket.on('updatePlayer', locMsg);
	socket.on('shoot', shootMsg);


	function keyMsg(key_data)
	{
		io.sockets.emit('key', key_data);
	}

	function shootMsg(shoot_data)
	{
		io.sockets.emit('shoot', shoot_data);
	}

	function locMsg(loc_data)
	{
		socket.broadcast.emit('updatePlayer', loc_data);
	}

}
