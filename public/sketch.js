// Alek Westover
// A multiplayer game

var socket;

var screen_dims = [600, 600];
var screen_color = [0, 0, 0];

var picture;

var playerLoc, enemyLoc;
var playerVel, enemyVel;

var maxSpeed = 1;
var acceleration = 0.5;

function setup() {
	createCanvas(screen_dims[0], screen_dims[1]);
	playerLoc = createVector(screen_dims[0]/2, screen_dims[1]);
	enemyLoc = createVector(screen_dims[0]/2, screen_dims[1]/2);

	playerVel = new p5.Vector(0, 0);
	enemyVel = createVector(0, 0);

	picture = loadImage("bear.png");
	socket = io.connect();
	socket.on('key', updateEnemy);
}


function draw() {
	background(0, 0, 0);
	displayCar(enemyLoc.x, enemyLoc.y);
	displayCar(playerLoc.x, playerLoc.y);

	if (playerVel.mag() > maxSpeed)
	{
		playerVel.mult(maxSpeed/playerVel.mag());
	}

	if (enemyVel.mag() > maxSpeed)
	{
		enemyVel.mult(maxSpeed/enemyVel.mag());
	}

	playerLoc.add(playerVel);//*dt
	enemyLoc.add(enemyLoc);//*dt
}

function displayCar(x, y)
{
	imageMode(CENTER);
	fill(255, 255, 255);
	image(picture, x, y);
}

function keyReleased() {
	playerVel += updateCarVector(key);
	var key_data = {k: key}
	socket.emit('key', key_data);
}

function updateCarVector(key)
{
	var outVector = new p5.Vector(0, 0);
	if (key == 'A' || key == 'a')
	{
		outVector.x = -acceleration;
	}
	else if (key == 'd' || key == 'D')
	{
		outVector.x = acceleration;
	}
	else if (key == 'w' || key == 'W')
	{
		outVector.y = -acceleration;
	}
	else if (key == 's' || key == 'S')
	{
		outVector.y = acceleration;
	}
	return outVector;
}

function updateEnemy()
{
	enemyVel += updateCarVector(key_data.k);
}

/*
function newDrawing(data) {
	fill(0, 0, 0);
	ellipse(data.x, data.y, 10, 10);
}
function displayText(key_data) {
	text(key_data.k, screen_dims[0]*random(), screen_dims[1]*random());
}
function mousePressed()
{
	var data = {
		x: mouseX,
		y: mouseY
	}
	socket.emit('mouse', data);
	newDrawing(data);
}
*/
