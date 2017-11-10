// My ship class
// Ship can be steered (turned),
//and the velocity can be turned up or down
//(but never below 0)

function Ship(dims, pos, dt) {
  this.dims = dims;
  this.mass = 1;
  this.maxSpeed = 30;
  this.maxAcc = this.maxSpeed*0.1;

  this.pos = pos;
  this.vel = createVector(0, 0);
  this.th = 0;
  this.angSpeed = 0.5;
  this.dt = dt;

  this.bulletSpeed = 40;
  this.bullets = [];

  this.color = [0, 255, 0];
};

/*
Ship design (rough)
>
var dims = createVector(center_x to right most x or left most x (1/2 max_width), \
total_height/2, y center to top or bottom);
var pos = createVector(center_x, center_y);
*/

Ship.prototype.show = function() {
  fill(this.color[0], this.color[1], this.color[2]);
  noStroke();
  this.bottom_pt = createVector(this.pos.x - this.dims.x, this.pos.y + this.dims.y);
  this.top_pt = createVector(this.pos.x - this.dims.x, this.pos.y - this.dims.y);
  this.right_pt = createVector(this.pos.x + this.dims.x, this.pos.y);
  applyMatrix();
  translate(this.pos.x, this.pos.y);
  rotate(this.th);
  triangle(-this.dims.x, this.dims.y, -this.dims.x, -this.dims.y, this.dims.x, 0);
  resetMatrix();
}

Ship.prototype.checkHitAsteroid = function(all_asteroids) {
  if (hitAsteroid(all_asteroids, this.pos, this.dims) != -1) {
    this.color = [0, 0, 255];
  }
}

Ship.prototype.update = function(all_asteroids) {
  this.pos.add(p5.Vector.mult(this.vel, this.dt));
  this.pos = wrapXYs(this.pos.x, this.pos.y);

  for (var i = this.bullets.length-1; i >= 0; i--) {
    this.bullets[i].show();
    this.bullets[i].update(this.dt);
    var bulletUsed = this.bullets[i].checkCollisions(all_asteroids);
    var bulletSpent = this.bullets[i].distanceTravelled > this.bullets[i].distanceTillDeath;
    var killable = bulletUsed || bulletSpent;
    if (killable) {
      this.bullets.splice(i, 1);
    }
  }

  this.checkHitAsteroid(all_asteroids);
}

Ship.prototype.accelerate = function() {
  var proposedVelocityAddition = p5.Vector.mult(p5.Vector.fromAngle(this.th), this.maxAcc*this.dt);
  if (p5.Vector.add(proposedVelocityAddition, this.vel).mag() < 0.9*this.maxSpeed) {
    this.vel.add(proposedVelocityAddition);
  }
}

Ship.prototype.turn = function(direction) {
  if (direction == "LEFT") {
    this.th -= this.angSpeed * this.dt;
  }
  else if (direction == "RIGHT") {
    this.th += this.angSpeed * this.dt;
  }
}

Ship.prototype.shoot = function() {
  this.bullets.push(new Bullet(this.pos.copy(), p5.Vector.fromAngle(this.th).mult(this.bulletSpeed), this.th, createVector(4, 16)));
}
