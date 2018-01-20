// Alek Westover
// A multiplayer game

let socket;
let screen_dims;
let screen_color = [0, 0, 0];
let playerLoc, enemyLoc;
let fakePlayerLoc;  // position the player seems to occupy to him
let fakeMultiplier = 1.1;
let playerVel, enemyVel;
const maxSpeed = 5;
const acceleration = 0.5;
const playerDims = new p5.Vector(300, 150);
const bulletOffset = playerDims.x*0.375;
const dt = 1;

let song;

let picture_selection = ["batch/dog1.png", "batch/dog2.png"];
let alt_picture_selection = ["batch/shark1.png", "batch/shark2.png"];
let special_sauce = 0;  // am I seceretly a shark?

let pct = 0;
let ect = 0;

let bullets = [];
let nextBulletId = 0;

function preload()
{
	song = loadSound("batch/MailmanSong2.mp3");
}

function setup() {
	screen_dims = [windowWidth, windowHeight];
	playerLoc = createVector(screen_dims[0] / 2, screen_dims[1] / 2);
	enemyLoc  = createVector(screen_dims[0] / 2, screen_dims[1] / 2);

	fakePlayerLoc = createVector(0, 0);
	fakePlayerLoc.set(playerLoc.x, playerLoc.y);

	// createVector is a synonym for createVector()
	playerVel = new p5.Vector(0, 0);
	enemyVel  = new p5.Vector(0, 0);

	socket = io.connect();
	socket.on('key', freakOut);
	socket.on('updatePlayer', updateEnemy);
	socket.on('shoot', addBullet);

	socket.on('loggedOn', handleLogIn);

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
	let newPos = createVector(shoot_data.px, shoot_data.py);
	let newVel = createVector(shoot_data.pvx, shoot_data.pvy);
	let newBullet = new Bullet(shoot_data.ccId, newPos, newVel, shoot_data.bulletOffset);
	newBullet.initialize();
	bullets.push(newBullet);
}

function handleLogIn(login_data)
{
	console.log("logged IN");
}

function freakOut(key_data)
{
	console.log("key pressed somewhere...");
}

function hashPwd(pwd)
{
	//this is a low key stupid algorithm
	let mod = 104729;  // prime
	let add = 7559;    // prime

	let prod = 1;
	for (let i = 0; i < pwd.length; i++)
	{
		prod = (prod*pwd.charCodeAt(i) + add) % mod;
	}
	return prod;
}

function isAlekCheck(pwd)
{
	if (hashPwd(pwd) == 80499)
	{
		// there is like a pretty good chance that you are Alek...
		return true;
	}
	return false;
}

function draw() {
	let offset = p5.Vector.sub(playerLoc, fakePlayerLoc);
	displayCar(enemyLoc.x - offset.x, enemyLoc.y - offset.y, '#bearEnemy');
	displayCar(fakePlayerLoc.x, fakePlayerLoc.y, '#bear');

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
		$('#bearEnemy').removeClass('flipped');
	}

	if (playerVel.x != 0){pct = (pct + 1) % 50;}
	if (enemyVel.x != 0){ect = (ect + 1) % 50;}

	if (special_sauce == 0)
	{
		if (pct == 0){$('#bear').attr("src", picture_selection[0]);}
		else if (pct == 25){$('#bear').attr("src", picture_selection[1]);}
	}
	else
	{
		if (pct == 0){$('#bear').attr("src", alt_picture_selection[0]);}
		else if (pct == 25){$('#bear').attr("src", alt_picture_selection[1]);}

		console.log("specialness");
	}

	if (ect == 0){$('#bearEnemy').attr("src", picture_selection[0]);}
	else if (ect == 25){$('#bearEnemy').attr("src", picture_selection[1]);}

	if (playerVel.mag() > maxSpeed){playerVel.mult(maxSpeed / playerVel.mag());}

	let change = p5.Vector.mult(playerVel, dt);

	playerLoc.add(change);
	let loc_data = {
		expos: playerLoc.x,
		eypos: playerLoc.y,
		exv: playerVel.x,
		eyv: playerVel.y
	}
	socket.emit('updatePlayer', loc_data);
	let proposal = p5.Vector.mult(p5.Vector.add(change, fakePlayerLoc), fakeMultiplier);
	if (vecInCanvas(proposal))
	{
		fakePlayerLoc.add(change);
	}

	for (let i = bullets.length - 1; i >= 0; i--)
	{
		let shiftx = -1*(playerLoc.x - fakePlayerLoc.x);
		let shifty = -1*(playerLoc.y - fakePlayerLoc.y);
		bullets[i].update(dt, shiftx, shifty);
		if (bullets[i].overboundary(screen_dims))
		{
			bullets[i].die();
			bullets.splice(i, 1);
		}
		else if(bullets[i].checkCollision(playerLoc, playerDims, socket.id))
		{
			alert("OWWWWW");
			bullets[i].die();
			bullets.splice(i, 1);
		}

	}

}

function displayCar(x, y, tag)
{
	$(tag).css("top", (y - playerDims.y / 2) + "px");
	$(tag).css("left", (x - playerDims.x / 2) + "px");
}


function buttonTrigger(action) {
	console.log("triggered");
	if (action == 'shoot')
	{
		let cId = 'bullet' + socket.id + '' + nextBulletId;

		let shoot_data = {
			ccId: cId,
			px: playerLoc.x,
			py: playerLoc.y,
			pvx: playerVel.x,
			pvy: playerVel.y,
			bulletOffset: bulletOffset
		}

		socket.emit('shoot', shoot_data);
		nextBulletId += 1;
	}
	else {
			playerVel.add(updateCarVector(action));
	}
}


function shootBull() {
	let cId = 'bullet' + socket.id + '' + nextBulletId;

	let shoot_data = {
		ccId: cId,
		px: playerLoc.x,
		py: playerLoc.y,
		pvx: playerVel.x,
		pvy: playerVel.y,
		bulletOffset: bulletOffset
	}

	socket.emit('shoot', shoot_data);
	nextBulletId += 1;
}

function keyReleased() {
	if (key == ' ') {shootBull();}
	playerVel.add(updateCarVector(key));
	let key_data = {
		k: key,
		expos: playerLoc.x,
		eypos: playerLoc.y
	}
	socket.emit('key', key_data);
}

function updateCarVector(key)
{
	let outVector = new p5.Vector(0, 0);
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
