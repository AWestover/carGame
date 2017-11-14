// Alek Westover
// A multiplayer game

var socket;
var screen_dims = [600, 600];
var screen_color = [0, 0, 0];
var picture;
var playerLoc, enemyLoc;
var playerVel, enemyVel;
const maxSpeed = 1;
const acceleration = 0.5;
const playersDims = new p5.Vector(80, 160);

function setup() {
	createCanvas(screen_dims[0], screen_dims[1]);
	playerLoc = createVector(screen_dims[0]/2, screen_dims[1]/2);
	enemyLoc = createVector(screen_dims[0]/2, screen_dims[1]/2);

	playerVel = new p5.Vector(0, 0);// same as createVector()
	enemyVel = new p5.Vector(0, 0);

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
		playerVel.mult(maxSpeed / playerVel.mag());
	}

	if (enemyVel.mag() > maxSpeed)
	{
		enemyVel.mult(maxSpeed / enemyVel.mag());
	}

	playerLoc.add(playerVel);//*dt (dt = 1)
	enemyLoc.add(enemyLoc);//*dt (dt = 1)

	if (!vecInCanvas(playerLoc))
	{
		playerLoc.subtract(playerVel);//*dt (dt = 1)
	}
	if (!vecInCanvas(enemyLoc))
	{
		enemyLoc.subrtract(enemyLoc);//*dt (dt = 1)
	}
}

function displayCar(x, y)
{
	imageMode(CENTER);
	fill(255, 255, 255);
	image(picture, x, y, playersDims.x, playersDims.y);
}

function keyReleased() {
	playerVel.add(updateCarVector(key));
	var key_data = {k: key, pos: playerLoc}
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

function updateEnemy(key_data)
{
	enemyVel.add(updateCarVector(key_data.k));
}

function vecInCanvas(vec)
{
		let xLIn = vec.x > 0;
		let xRIn = vec.x < screen_dims[0];

		let yUIn = vec.y > 0;
		let yLIn = vec.y < screen_dims[1];

		return (xLIn && xRIn && yUIn && yLIn);
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
