// Alek Westover

var socket;

var screen_dims = [600, 600];
var screen_color = [0, 0, 0];

var picture;

var imageLoc = [300, 300];

function setup() {
	createCanvas(screen_dims[0], screen_dims[1]);

	picture = loadImage("car.png");

	socket = io.connect();

	socket.on('mouse', newDrawing);
	socket.on('key', displayText);
}

function newDrawing(data) {
	fill(0, 0, 0);
	//console.log(data);
	ellipse(data.x, data.y, 10, 10);
}

function displayText(key_data) {
	//console.log(key_data);
	text(key_data.k, screen_dims[0]*random(), screen_dims[1]*random());
}

function draw() {
	imageMode(CENTER);
	fill(255, 255, 255);
	image(picture, imageLoc[0], imageLoc[1]);
	//image(picture, mouseX, mouseY);
}


function displayCar()
{
	//background(255, 255, 255);
	imageMode(CENTER);
	fill(255, 255, 255);
	image(picture, imageLoc[0], imageLoc[1]);
}


function updateCar(key)
{
	var speed = 10;
	if (key == 'A' || key == 'a')
	{
		imageLoc[0] -= speed;
	}
	if (key == 'd' || key == 'D')
	{
		imageLoc[0] += speed;
	}
	if (key == 'w' || key == 'W')
	{
		imageLoc[1] -= speed;
	}
	if (key == 's' || key == 'S')
	{
		imageLoc[1] += speed;
	}
}

function mousePressed() {
	//console.log(mouseX, mouseY);
	var data = {
		x: mouseX,
		y: mouseY
	}
	socket.emit('mouse', data);
	newDrawing(data);
}

function keyReleased() {
	//console.log(key);
	updateCar(key);
	var key_data = {
		k: key
	}
	socket.emit('key', key_data);
	displayText(key_data);
}
