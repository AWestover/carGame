function Bullet(ref, initPos, initVel)
{
  this.ref = ref;
  this.el = $(ref);
  this.pos = initPos;
  this.pos.y -= 30;
  this.vel = p5.Vector.fromAngle(initVel.heading()).mult(5);
}

Bullet.prototype.update = function () {
  this.pos.add(this.vel);
  this.el.css("left", this.pos.x);
  this.el.css("top", this.pos.y);
};
