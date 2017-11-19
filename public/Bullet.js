function Bullet(ref, initPos, initVel)
{
  this.ref = ref;
  this.el = $('#' + this.ref);
  this.pos = initPos;
  this.pos.y -= 30;
  this.vel = p5.Vector.fromAngle(initVel.heading()).mult(5);
}

Bullet.prototype.initialize = function()
{
  if (this.el.length == 0)
  {
    $('body').append('<img id=' + this.ref + ' class="bullet" src="batch/bullet.png" ></img>');
    this.el = $('#' + this.ref);
    $('#' + this.ref).css("top", "0px");
    $('#' + this.ref).css("left", "0px");
  }
}

Bullet.prototype.update = function (dt)
{
  this.pos.add(this.vel.mult(dt));
  this.el.css("left", this.pos.x + "px");
  this.el.css("top", this.pos.y + "px");
};
