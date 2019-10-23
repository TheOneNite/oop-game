class Avalanche {
  constructor(xCoord, yCoord) {
    this.moveSpeed = 20;
    this.height = ENEMY_HEIGHT;
    this.x = xCoord;
    this.y = yCoord;
    this.sprite = document.createElement("img");
    this.sprite.src = "./images/pngs/avalanche.png";
    this.sprite.style.position = "absolute";
    this.sprite.style.height = this.height + "px";
    this.sprite.style.width = ENEMY_WIDTH + "px";
    this.sprite.style.left = xCoord + "px";
    this.sprite.style.top = (this.height - 50) * -1 + "px";
    this.sprite.style.zIndex = 2;
    this.destroyFlag = false;
    /*this.hitbox = {
      xMax: this.x + ENEMY_WIDTH,
      xMin: this.x,
      yMax: this.y + this.height,
      yMin: this.y - ENEMY_HEIGHT
    };*/
    this.tickFn = this.moveTick;
  }

  collider = () => {
    this.hitbox = {
      xMax: this.x + ENEMY_WIDTH,
      xMin: this.x,
      yMax: this.y + this.height,
      yMin: this.y
    };
    //console.log("yMax" + this.hitbox.yMax);
    //console.log("yMin" + this.hitbox.yMin);
  };

  tick = () => {
    this.tickFn();
    setTimeout(this.tick, 30);
  };

  moveTick = () => {
    this.y = this.y + this.moveSpeed;
    this.sprite.style.top = this.y;
    this.collider();
  };

  blockedTick = () => {
    if (this.height < 1) {
      this.destroyFlag = true;
      return;
    }
    this.y = this.y + this.moveSpeed;
    this.sprite.style.top = this.y;
    this.height = this.height - this.moveSpeed;
    this.sprite.style.height = this.height;
    this.collider();
  };

  breakAway = () => {
    if (this.height < ENEMY_HEIGHT) {
      console.log("growing");
      this.height = this.height + this.moveSpeed;
      this.sprite.style.height = this.height;
    } else {
      this.tickFn = this.moveTick;
    }
    this.collider();
  };
}
