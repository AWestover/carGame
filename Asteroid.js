// The astroid class
// please note all trig here uses radians by default

// Any asteroid with avgRadius less than this wil not split
var criticalRadius = 25;

function Asteroid(avgRadius, pos, vel) {
	this.avgRadius = avgRadius;
	this.pos = pos;
	this.vel = vel;
	this.th = 0;
	this.angSpeed = random(-0.2, 0.2);
	this.generateRandomVertices();
}

Asteroid.prototype.generateRandomVertices = function() {
	var num_vertices = round(6 + 10*random());
	this.vertexCenterDeltas = [];
	this.vertexNoise = [];
	for (var i = 0; i < num_vertices; i++) {
		var cur_edge_th = i*(TWO_PI/num_vertices);
		var noiseX = 0.6*this.avgRadius*random();
		var noiseY = 0.6*this.avgRadius*random();
		this.vertexNoise.push([noiseX, noiseY]);
		var nextX = this.avgRadius*cos(cur_edge_th) + noiseX;
		var nextY = this.avgRadius*sin(cur_edge_th) + noiseY;
		this.vertexCenterDeltas.push([nextX, nextY]);
	}
}

Asteroid.prototype.show = function() {
	fill(255, 255, 255, 200);
	beginShape();
	for (var i = 0; i < this.vertexCenterDeltas.length; i++) {
		vertex(this.vertexCenterDeltas[i][0] + this.pos.x, this.vertexCenterDeltas[i][1] + this.pos.y);
	}
	endShape(CLOSE);
}

Asteroid.prototype.update = function(dt) {
	this.pos.add(p5.Vector.mult(this.vel, dt));
	this.pos = wrapXYs(this.pos.x, this.pos.y);
	for (var i = 0; i < this.vertexCenterDeltas.length; i++) {
		var cur_edge_th = i*(TWO_PI/this.vertexCenterDeltas.length);
		var nextX = this.avgRadius*cos(cur_edge_th + this.th) + this.vertexNoise[i][0];
		var nextY = this.avgRadius*sin(cur_edge_th + this.th) + this.vertexNoise[i][1];
		this.vertexCenterDeltas[i] = [nextX, nextY];
	}
	this.th += this.angSpeed*dt;
}

Asteroid.prototype.halfs = function(bullet) {
	bulletSpeedMultiplier = bullet.vel.mag()*0.1;
	var ast1vel = p5.Vector.fromAngle(bullet.vel.heading()+PI/2).mult(bulletSpeedMultiplier).add(this.vel);
	var ast2vel = p5.Vector.fromAngle(bullet.vel.heading()-PI/2).mult(bulletSpeedMultiplier).add(this.vel);
	var ast1 = new Asteroid(this.avgRadius/2, this.pos.copy(), ast1vel);
	var ast2 = new Asteroid(this.avgRadius/2, this.pos.copy(), ast2vel);
	return [ast1, ast2];
}

function breakAsteroid(index, bullet) {
	if (!pause) {
		if (asteroids[index].avgRadius > criticalRadius) {
			var twoNewHalfs =  asteroids[index].halfs(bullet);
			asteroids[index] = twoNewHalfs[0];
			asteroids.push(twoNewHalfs[1]);
		}
		else {
			asteroids.splice(index, 1);
		}
	}
}
