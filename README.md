# socketTest
Socket test


Instructions:

to run this you need to download the code first

git init

git remote add origin X

git pull origin master

then install dependencies

npm install

(you must be in the same file as packages.json)

then run the node server

node index.js

(from the appropriate folder)

then go to localhost:3000
(not 8000)

you are good to go now



# edits needed

a map that you can move arround in
another tab for a store in which you can change your avatar
a chat app linked to it
leaderboard and multiple people at once


# NOTES on socket.io
for every socket.io application the goal is to make a single thing usable by multiple
users. People connect to the server via sockets and communicate.
index.js is the server that is run with node
this opens up a server which clients can connect to

when a client connects to the server the public file  is server to them (index.html, sketch.js,
and all other necessary files like pictures)

the clients then can emit certain messages and the server will tell other clients when a message has been emitted


# Basic code


index.js must look something like this
'''
var express = require('express'); // needs this library
var app = express();
var port = process.env.PORT || 3000;  // what port to open it on must have the option to be
// chosen by server if you want it to be heroku compatible, also does need the default
var server = require('http').createServer(app).listen(port);
app.use(express.static('public'));
console.log("server running");
var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);  // when you get a connection do this

function newConnection(socket) {
  // what to listen for
	socket.on('key', keyMsg);
	socket.on('updatePlayer', locMsg);
	socket.on('shoot', shootMsg);

  // these are the functions that send data

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
'''

In index.html you must import all the code like this
'''
<!DOCTYPE html>
<html>
<head>
  <!-- resize -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">

  <!-- p5 libraries-->
  <script src="libraries/p5/p5.js" type="text/javascript"></script>
  <script src="libraries/p5/addons/p5.dom.js" type="text/javascript"></script>
	<script src="libraries/p5/addons/p5.sound.js" type="text/javascript"></script>
  <!--jquery-->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <!-- main program -->
  <script src="sketch.js" type="text/javascript"></script>
  <!-- node libraries -->
  <script src="/socket.io/socket.io.js"></script>
  <!-- style -->
  <link rel="stylesheet" type="text/css" href="index.css">
  <!-- classes -->
  <script src="Bullet.js" type="text/javascript"></script>
</head>
</html>
'''

Then in public/sketch.js you have to have the socket control too
'''
let socket = io.connect();

// when we are sent a 'key' or a message to 'updateEnemy' we call these functions
socket.on('key', freakOut);
socket.on('updatePlayer', updateEnemy);
socket.on('shoot', addBullet);

//we also have to emit data
let loc_data = {
  expos: playerLoc.x,
  eypos: playerLoc.y,
  exv: playerVel.x,
  eyv: playerVel.y
}
socket.emit('updatePlayer', loc_data);
// note the names must match
'''

# pushing to heroku notes
Once you have followed the above notes to create a functional project there are some additional steps
to putting it on heroku

You will need a heroku account

all info is in the below tutorial
https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction


first do
'''
# Run this from your terminal.
# The following will add our apt repository and install the CLI:
sudo add-apt-repository "deb https://cli-assets.heroku.com/branches/stable/apt ./"
curl -L https://cli-assets.heroku.com/apt/release.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install heroku
'''
then

heroku login

you might need to do
heroku create

and then add dependencies to packages.json
"dependencies": { "express": "^4.15.3", "socket.io": "^2.0.3" }

this might be important
heroku buildpacks:set heroku/nodejs
also might need a procfile thinf

or
heroku git:clone -a alek-car-game

depending on whether it is a new app or not

git push heroku master


_(improve this guide later)_

# this application is hosted at the site below
http://alek-car-game.herokuapp.com/
