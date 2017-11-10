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

// Coded by Alek Westover

/*
BUGS:
ship can spawn on asteroid
better ship collisions are needed
spinning asteroid glitch
win lose states
*/


// Constants and imported stuff and global variables
var screen_dims;
var screen_color;
var dt;
var ship;
var num_asteroids = 1;
var asteroids;
var pause = false;
var debugMode = true;

// A function that resets all parameters to default values
// caled on start and restart of game
function set_default_parameters() {
  screen_dims = [windowWidth, windowHeight];
  screen_color = [0, 0, 0, 50];
  dt = 0.3;

  num_asteroids = num_asteroids + 2;
  asteroids = [];
  for (var i = 0; i < num_asteroids; i++) {
    asteroids.push(new Asteroid(random(30, 60), createVector(random()*screen_dims[0],
                  random()*screen_dims[1]), createVector(random(-5, 5), random(-5, 5))));
  }

  //prevent the ship from spawning on an asteroid...

  var shipPosI = createVector(map(random(), 0, 1, 0.1*screen_dims[0], 0.9*screen_dims[0]),
    map(random(), 0, 1, 0.1*screen_dims[1], 0.9*screen_dims[1]));
  ship = new Ship(createVector(20.0, 10.0), shipPosI, dt);

}

// set variables
function setup() {
  set_default_parameters();
  createCanvas(screen_dims[0], screen_dims[1]);
  frameRate(100*dt);
}

// main loop
function draw() {
  if (asteroids.length == 0) {
      pause = true;
      background(screen_color[0], screen_color[1], screen_color[2]);
      ship.show();
      set_default_parameters();
      text("Game Over. Press pause to start again.", 100, 100);
  }
  if (!pause) {
    background(screen_color[0], screen_color[1], screen_color[2]);

    ship.show();
    ship.update(asteroids);
    // Left37, A65
    if (keyIsDown(37) || keyIsDown(65)) {
      ship.turn('LEFT');
    }
    // Right39, D68
    else if (keyIsDown(39) || keyIsDown(68)) {
      ship.turn('RIGHT');
    }
    // Up38, W87
    else if (keyIsDown(38) || keyIsDown(87)) {
      ship.accelerate();
    }

    for (var i = 0; i < asteroids.length; i++) {
      asteroids[i].show();
      asteroids[i].update(dt);
    }
  }
}

// checks for collision with an asteroid
function hitAsteroid(all_asteroids, otherObjectPos, otherObjectDims) {
  // this is currently very stupid collision detection
  // I think that we can somehow loop over the vertices
  // of the asteroids and look if the object hit any of the
  // segments connecting them or something
  // but for now ...
  var asteroidHit = -1;
  for (var i = 0; i < all_asteroids.length; i++) {
    if (p5.Vector.sub(all_asteroids[i].pos, otherObjectPos).mag() < all_asteroids[i].avgRadius) {
      asteroidHit = i;
      break;
    }
  }
  return asteroidHit;
}

// makes the polygon vertices loop back to the first vertex for a closed figure
function close_polygon(unclosed_polygon_vertices) {
  var b = unclosed_polygon_vertices.slice();
  b.push(unclosed_polygon_vertices[0]);
  return b;
}

// determines if a number is between 2 other numbers (doesn't matter which is bigger)
function quantity_between(quantity, bound1, bound2) {
  var upper = max(bound1, bound2);
  var lower = min(bound1, bound2);
  return (lower < quantity && quantity < upper);
}

// checks if a point is in a polygon
function pointInPolygon(point, polygon_vertices) {
  //I use the rightwards facing horizontal line
  var num_collisions = 0;
  for (var i = 0; i < polygon_vertices.length - 1; i++) {
    //the actual side of the polygon
    // m1 = delta y / delta x
    var m1 = (polygon_vertices[i+1][1] - polygon_vertices[i][1]) / (polygon_vertices[i+1][0] - polygon_vertices[i][0]);
    // b1 = y - mx
    var b1 = polygon_vertices[i][1] - m1 * polygon_vertices[i][0];

    // the horizontal line (we will make it a ray originating from point[0], point[1] later)
    // m2 = delta y / delta x
    var m2 = 0;
    // b2 = y - mx
    var b2 = point[1];

    // calculating intersection coordinates requires a lot of algebra
    var yi = (b1 * m2 - b2 * m1) / (m2 - m1);
    var xi = (b2 - b1) / (m1 - m2);

    /// if the ray hit the line on the polygon
    if (quantity_between(yi, polygon_vertices[i][1], polygon_vertices[i+1][1])) {
      if (quantity_between(xi, polygon_vertices[i][0], polygon_vertices[i+1][0]) && xi > point[0]) {
        num_collisions += 1;
      }
    }
  }
  return (num_collisions % 2 == 1);
}

// returns the same x, y values unless they need to be wrapped around the canvas
function wrapXYs(x, y) {
  outx = x;
  outy = y;
  if (x > 1.01*screen_dims[0]) {
		outx = -0.01*screen_dims[0];
	}
  if (x < -0.01*screen_dims[0]) {
		outx = 1.01*screen_dims[0];
	}
	if (y > 1.01*screen_dims[1]) {
		outy = -0.01*screen_dims[1];
	}
	if (y < -0.01*screen_dims[1]) {
		outy = 1.01*screen_dims[1];
	}
  return createVector(outx, outy);
}

// checks if the key has been released (not just pressed)
function keyReleased() {
  if (key.toLowerCase() == "p") {
    pause = !pause;
  }
  // Space32
  else if (key.charCodeAt() == 32) {
    ship.shoot();
  }
}

function mousePressed() {
  if (debugMode) {
    console.log("MouseX", mouseX, "MouseY", mouseY);
  }
}
