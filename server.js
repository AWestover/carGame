//
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

var port = process.env.PORT || 3000;

server.listen(port);

console.log("server.js is running");

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});


io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  //disconect
  socket.on('disconnect', function(data) {
    connections.splice(connections.indexOf(socket), 1);
    console.log("Connected: %s sockets connected", connections.length);
  });


  //send message
  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg: data});
  })

});
