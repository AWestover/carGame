// Alek Westover

var socket;

var screen_dims = [600, 600];
var screen_color = [0, 0, 0];

var picture;

var playerLoc = [screen_dims[0]/2, screen_dims[1]/2];
var enemyLoc = [screen_dims[0]/2, screen_dims[1]/2];

function setup() {
	createCanvas(screen_dims[0], screen_dims[1]);

	picture = loadImage("car.png");

	socket = io.connect();

	//socket.on('mouse', newDrawing);
	socket.on('key', updateEnemy);
}


function draw() {
	background(0, 0, 0);
	displayCar(enemyLoc[0], enemyLoc[1]);
	displayCar(playerLoc[0], playerLoc[1]);
}

function displayCar(x, y)
{
	imageMode(CENTER);
	fill(255, 255, 255);
	image(picture, x, y);
}

function keyReleased() {
	var cUpdate = updateCar(key);
	playerLoc[0] += cUpdate[0];
	playerLoc[1] += cUpdate[1];
	var key_data = {
		k: key
	}
	socket.emit('key', key_data);
	//displayText(key_data);
}

function updateCarVector(key)
{
	var speed = 10;
	var outVector = [0, 0];
	if (key == 'A' || key == 'a')
	{
		outVector[0] = -speed;
	}
	else if (key == 'd' || key == 'D')
	{
		outVector[0] = speed;
	}
	else if (key == 'w' || key == 'W')
	{
		outVector[1] = -speed;
	}
	else if (key == 's' || key == 'S')
	{
		outVector[1] = speed;
	}
	return outVector;
}


function updateEnemy(key_data)
{
	var cUpdate = updateCar(key_data.k);
	enemyLoc[0] += enemyLoc[0];
	enemyLoc[1] += enemyLoc[1];
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
