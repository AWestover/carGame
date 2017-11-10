// Alek Westover

var socket;

var screen_dims = [600, 600];
var screen_color = [0, 0, 0];

function setup() {
	createCanvas(screen_dims[0], screen_dims[1]);

	socket = io.connect('http://localhost:3000'); //localhost and 127.0.0.1 are equivalent
	socket.on('mouse', newDrawing);
	socket.on('key', displayText);
}

function newDrawing(data) {
	fill(0, 0, 0);
	console.log(data);
	ellipse(data.x, data.y, 10, 10);
}

function displayText(key_data) {
	console.log(key_data);
	text(key_data.k, screen_dims[0]*random(), screen_dims[1]*random());
}

function draw() {
	ellipseMode(CENTER);
	fill(255, 255, 255);
	ellipse(mouseX, mouseY, 500, 500);
}


function mousePressed() {
	console.log(mouseX, mouseY);
	var data = {
		x: mouseX,
		y: mouseY
	}
	socket.emit('mouse', data);
	newDrawing(data);
}

function keyReleased() {
	console.log(key);
	var key_data = {
		k: key
	}
	socket.emit('key', key_data);
	displayText(key_data);
}
