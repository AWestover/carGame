function Bullet(ref, initPos, initVel, bulletOffset)
{
  this.bulletOffset = bulletOffset;
  this.ref = ref;
  this.el = $('#' + this.ref);
  this.pos = initPos;
  this.pos.y -= bulletOffset/2;
  if (initVel.x < 0)
  {
    this.vel = createVector(-5, initVel.y);
    this.pos.x -= this.bulletOffset;
  }
  else
  {
    this.vel = createVector(5, initVel.y);
    this.pos.x += this.bulletOffset;
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

Bullet.prototype.overboundary = function(screen_dims)
{
  var xOut = this.pos.x > screen_dims[0] || this.pos.x < 0;
  var yOut = this.pos.y > screen_dims[1] || this.pos < 0;
  return xOut || yOut;
}

Bullet.prototype.die = function()
{
  $('#' + this.ref).remove();
}

Bullet.prototype.checkCollision = function(pLoc, pDims, id)
{
  // don't bother checking collisions with bullets that you shot yourself...
  if (this.ref.indexOf(id) == -1)
  {
    var bulletWidth = parseInt(this.el.css("width"));
    var bulletHeight = parseInt(this.el.css("height"));

    var leftIn = this.pos.x < pLoc.x + pDims.x/2;
    var rightIn = this.pos.x + bulletWidth > pLoc.x - pDims.x/2;
    var topIn = this.pos.y < pLoc.y + pDims.y/2;
    var bottomIn = this.pos.y + bulletHeight > pLoc.y - pDims.y/2;

    console.log(leftIn + " " + rightIn + " "  + topIn + " " + bottomIn);


    return leftIn && rightIn && bottomIn && topIn;

  }
  else {
    return false;
  }
}
