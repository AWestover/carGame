// Alek Westover
// A multiplayer game

var socket;
var screen_dims;
var screen_color = [0, 0, 0];
var picture;
var playerLoc, enemyLoc;
var playerVel, enemyVel;
const maxSpeed = 5;
const acceleration = 0.5;
const playerDims = new p5.Vector(80, 160);
const dt = 1;

function setup() {
	screen_dims = [windowWidth, windowHeight];
	playerLoc = createVector(screen_dims[0] / 2, screen_dims[1] / 2);
	enemyLoc = createVector(screen_dims[0] / 2, screen_dims[1] / 2);

	// createVector is a synonym for createVector()
	playerVel = new p5.Vector(0, 0);
	enemyVel = new p5.Vector(0, 0);

	picture = loadImage("bear.png");
	socket = io.connect();
	socket.on('key', freakOut);
	socket.on('updatePlayer', updateEnemy);
	jQuery('<img/>', {
    id: 'bear',
    src: 'bear.png',
		width: playerDims.x,
		height: playerDims.y
	}).appendTo('body');
	jQuery('<img/>', {
    id: 'bearEnemy',
    src: 'bear.png',
		width: playerDims.x,
		height: playerDims.y
	}).appendTo('body');
}


function freakOut(key_data)
{
	console.log("ahh");
}

function draw() {
	displayCar(enemyLoc.x, enemyLoc.y, '#bearEnemy');
	displayCar(playerLoc.x, playerLoc.y, '#bear');

	if (playerVel.mag() > maxSpeed)
	{
		playerVel.mult(maxSpeed / playerVel.mag());
	}

	var nextVel = p5.Vector.add(p5.Vector.mult(playerVel, dt), playerLoc);
	if (vecInCanvas(nextVel) && playerVel.mag() != 0)
	{
		playerLoc.add(playerVel.mult(dt));
		var loc_data = {
			expos: playerLoc.x,
			eypos: playerLoc.y
		}
		socket.emit('updatePlayer', loc_data);
	}
	else {
		playerVel.mult(0);
	}

}

function displayCar(x, y, tag)
{
	$(tag).css("top", (y - playerDims.y / 2) + "px");
	$(tag).css("left", (x - playerDims.x / 2) + "px");
}

function keyReleased() {
	playerVel.add(updateCarVector(key));
	var key_data = {
		k: key,
		expos: playerLoc.x,
		eypos: playerLoc.y
	}
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

function updateEnemy(loc_data)
{
	enemyLoc.set(loc_data.expos, loc_data.eypos);
}

function vecInCanvas(vec)
{
		let xLIn = vec.x > playerDims.x / 2;
		let xRIn = vec.x < screen_dims[0] - playerDims.x / 2;

		let yUIn = vec.y > playerDims.y / 2;
		let yLIn = vec.y < screen_dims[1] - playerDims.y / 2;

		return (xLIn && xRIn && yUIn && yLIn);
}
