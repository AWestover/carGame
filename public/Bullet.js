function Bullet(ref, initPos, initVel)
{
  this.ref = ref;
  this.el = $('#' + this.ref);
  this.pos = initPos;
  this.pos.y -= 30;
  if (initVel.x < 0)
  {
    this.vel = createVector(-5, 0);
  }
  else
  {
    this.vel = createVector(5, 0);
  }
}

Bullet.prototype.initialize = function()
{
  if (this.el.length == 0)
  {
    $('body').append('<img id=' + this.ref + ' class="bullet" src="batch/bullet2.png" ></img>');
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
