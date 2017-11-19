function Bullet(ref, initPos, initVel)
{
  this.ref = ref;
  this.el = $(ref);
  this.pos = initPos;
  this.pos.y -= 30;
  this.vel = p5.Vector.fromAngle(initVel.heading()).mult(5);
}

Bullet.prototype.update = function (dt) {
  this.pos.add(this.vel.mult(dt));
  this.el.css("left", this.pos.x + "px");
  this.el.css("top", this.pos.y + "px");
};
