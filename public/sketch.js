// Alek Westover
// A multiplayer game

var socket;
var screen_dims;
var screen_color = [0, 0, 0];
var playerLoc, enemyLoc;
var playerVel, enemyVel;
const maxSpeed = 5;
const acceleration = 0.5;
const playerDims = new p5.Vector(160, 80);
const dt = 1;

var pct = 0;
var ect = 0;

var bullets = [];
var nextBulletId = 0;

function setup() {
	screen_dims = [windowWidth, windowHeight];
	playerLoc = createVector(screen_dims[0] / 2, screen_dims[1] / 2);
	enemyLoc = createVector(screen_dims[0] / 2, screen_dims[1] / 2);

	// createVector is a synonym for createVector()
	playerVel = new p5.Vector(0, 0);
	enemyVel = new p5.Vector(0, 0);

	socket = io.connect();
	socket.on('key', freakOut);
	socket.on('updatePlayer', updateEnemy);
	socket.on('shoot', addBullet);

	jQuery('<img/>', {
    id: 'bear',
    src: 'batch/dog1.png',
		width: playerDims.x,
		height: playerDims.y
	}).appendTo('body');

	jQuery('<img/>', {
    id: 'bearEnemy',
    src: 'batch/dog1.png',
		width: playerDims.x,
		height: playerDims.y
	}).appendTo('body');
}

function addBullet(shoot_data)
{
	var newPos = createVector(shoot_data.px, shoot_data.py);
	var newVel = createVector(shoot_data.pvx, shoot_data.pvy);
	var newBullet = new Bullet(shoot_data.ccId, newPos, newVel);
	newBullet.initialize();
	bullets.push(newBullet);
}

function freakOut(key_data)
{
	console.log("key pressed somewhere...");
}

function draw() {
	displayCar(enemyLoc.x, enemyLoc.y, '#bearEnemy');
	displayCar(playerLoc.x, playerLoc.y, '#bear');

	if (playerVel.x < 0 && !$('#bear').hasClass("flipped"))
	{
		$('#bear').addClass('flipped');
	}
	else if (playerVel.x > 0 && $('#bear').hasClass("flipped"))
	{
		$('#bear').removeClass('flipped');
	}
	if (enemyVel.x < 0 && !$('#bearEnemy').hasClass("flipped"))
	{
		$('#bearEnemy').addClass('flipped');
	}
	else if (enemyVel.x > 0 && $('#bearEnemy').hasClass("flipped"))
	{
		console.log("should flip");
		$('#bearEnemy').removeClass('flipped');
	}

	if (playerVel.x != 0){pct = (pct + 1) % 50;}
	if (enemyVel.x != 0){ect = (ect + 1) % 50;}

	if (pct == 0){$('#bear').attr("src", "batch/dog1.png");}
	else if (pct == 25){$('#bear').attr("src", "batch/dog2.png");}
	if (ect == 0){$('#bearEnemy').attr("src", "batch/dog1.png");}
	else if (ect == 25){$('#bearEnemy').attr("src", "batch/dog2.png");}

	if (playerVel.mag() > maxSpeed){playerVel.mult(maxSpeed / playerVel.mag());}

	var nextVel = p5.Vector.add(p5.Vector.mult(playerVel, dt), playerLoc);
	if (vecInCanvas(nextVel) && playerVel.mag() != 0)
	{
		playerLoc.add(playerVel.mult(dt));
		var loc_data = {
			expos: playerLoc.x,
			eypos: playerLoc.y,
			exv: playerVel.x,
			eyv: playerVel.y
		}
		socket.emit('updatePlayer', loc_data);
	}
	else {
		playerVel.mult(0);
	}

	for (var i = 0; i < bullets.length; i++)
	{
		bullets[i].update(dt);
	}

}

function displayCar(x, y, tag)
{
	$(tag).css("top", (y - playerDims.y / 2) + "px");
	$(tag).css("left", (x - playerDims.x / 2) + "px");
}

function keyReleased() {
	if (key == ' ') // shoot
	{
		var cId = 'bullet' + socket.id + '' + nextBulletId;
		$('body').append('<img id=' + cId + ' class="bullet" src="batch/bullet2.png" ></img>');
		$('#' + cId).css("top", "0px");
		$('#' + cId).css("left", "0px");

		var shoot_data = {
			ccId: cId,
			px: playerLoc.x,
			py: playerLoc.y,
			pvx: playerVel.x,
			pvy: playerVel.y
		}

		socket.emit('shoot', shoot_data);
		nextBulletId += 1;
	}
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
	enemyVel.set(loc_data.exv, loc_data.eyv);
}

function vecInCanvas(vec)
{
		let xLIn = vec.x > playerDims.x / 2;
		let xRIn = vec.x < screen_dims[0] - playerDims.x / 2;

		let yUIn = vec.y > playerDims.y / 2;
		let yLIn = vec.y < screen_dims[1] - playerDims.y / 2;

		return (xLIn && xRIn && yUIn && yLIn);
}
