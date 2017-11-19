function Bullet(ref, initPos, initVel)
{
  this.ref = ref;
  this.el = $('#' + this.ref);
  this.pos = initPos;
  this.pos.y -= 30;
  this.vel = p5.Vector.fromAngle(initVel.heading()).mult(5);
}

Bullet.prototype.initialize()
{
  if (this.el.length == 0)
  {
    $('body').append('<img id=' + this.ref + ' class="bullet" src="batch/bullet.png" ></img>');
    this.el.css("top", "0px");
    this.el.css("left", "0px");
  }
}

Bullet.prototype.update = function (dt)
{
  this.pos.add(this.vel.mult(dt));
  this.el.css("left", this.pos.x + "px");
  this.el.css("top", this.pos.y + "px");
};
