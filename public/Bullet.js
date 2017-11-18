function Bullet(ref)
{
  this.ref = ref;
  this.el = $(ref);
  this.pos = createVector(0, 0);
  this.vel = createVector(1, 1);
}

Bullet.prototype.update = function () {
  this.pos.add(this.vel);
  this.el.addClass("flipped");
};
