// The bullet class
// describes how the bullets fly, look, die, and kill

function Bullet(pos, vel, th, dims) {
  this.pos = pos;
  this.vel = vel;
  this.th  = th;
  this.dims = dims;
  this.distanceTravelled = 0;
  this.distanceTillDeath = (screen_dims[0] + screen_dims[1])*(0.5+random()*0.5);
};

Bullet.prototype.show = function() {
  fill(225, 0, 0);
  applyMatrix();
  translate(this.pos.x, this.pos.y);
  rotate(this.th+PI/2);
  ellipse(0, 0, this.dims.x, this.dims.y);
  resetMatrix();
}

Bullet.prototype.update = function(dt) {
  this.pos.add(p5.Vector.mult(this.vel, dt));
  this.distanceTravelled += p5.Vector.mult(this.vel, dt).mag();
  this.pos = wrapXYs(this.pos.x, this.pos.y);
}

Bullet.prototype.checkCollisions = function(all_asteroids) {
  var hit = false;
  // old circle method (very bad)
  var asteroidHit = hitAsteroid(all_asteroids, this.pos, this.dims);
  // new point in polygon method (not perfect)
  var goodAsteroidHit = -1;
  for (var i = 0; i < all_asteroids.length; i++) {
    var cur_asteroid_vertices = [];
    for (var j = 0; j < all_asteroids[i].vertexCenterDeltas.length; j++) {
      var nxcav = all_asteroids[i].vertexCenterDeltas[j][0] + all_asteroids[i].pos.x;
      var nycav = all_asteroids[i].vertexCenterDeltas[j][1] + all_asteroids[i].pos.y;
      cur_asteroid_vertices.push([nxcav, nycav]);
  	}
    cur_asteroid_vertices = close_polygon(cur_asteroid_vertices);

    // these are not the correct points because of the bullets rotation fix later
    var pt1In = pointInPolygon([this.pos.x, this.pos.y], cur_asteroid_vertices);
    var pt2In = pointInPolygon([this.pos.x + (this.dims.x*0.4)*cos(this.th+PI/2), this.pos.y - (this.dims.x*0.4)*sin(this.th+PI/2)], cur_asteroid_vertices);
    var pt3In = pointInPolygon([this.pos.x - (this.dims.x*0.4)*cos(this.th+PI/2), this.pos.y + (this.dims.x*0.4)*sin(this.th+PI/2)], cur_asteroid_vertices);

    if (pt1In || pt2In || pt3In) {
      goodAsteroidHit = i;
    }
  }
  if  (goodAsteroidHit != -1) {
    if (debugMode) {
  		pause = true;
  	}
    breakAsteroid(goodAsteroidHit, this);
    hit = true;
  }
  return hit;
}
