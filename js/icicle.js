class Icicle {
  constructor(xCoord, yCoord, spawnFn, cleanFn) {
    this.x = xCoord;
    this.y = yCoord;
    this.moveSpeed = 45;
    this.sprite = document.createElement("img");
    this.sprite.src = "./images/pngs/icicle.png";
    this.sprite.style.height = SPIKE_HEIGHT;
    this.sprite.style.width = SPIKE_WIDTH;
    this.sprite.style.position = "absolute";
    this.sprite.style.top = this.y;
    this.sprite.style.left = this.x;
    this.shakeAmount = 1;
    this.shakeDir = this.getDir();
    this.shakeInterval = 0;
    this.shakeThresh = 500;
    this.ticking = false;
    this.tickFn = this.shake;
    this.falling = false;
    this.newIce = spawnFn;
    this.cleanupFn = cleanFn;
    this.destroyFlag = false;
    this.hitbox = {
      xMax: this.x + SPIKE_WIDTH,
      xMin: this.x,
      yMax: this.y + SPIKE_HEIGHT,
      yMin: this.y
    };
  }

  getDir = () => {
    if (Math.random() > 0.5) {
      console.log("startUp");
      return true;
    }
    console.log("startDown");
    return false;
  };

  tick = () => {
    if (this.ticking) {
      this.tickFn(30);
      setTimeout(this.tick, 30);
    }
  };

  shake = deltaT => {
    //this.shakeAmount = this.shakeAmount + Math.random() * 0.1;
    this.shakeInterval = this.shakeInterval + deltaT;
    if (this.shakeInterval > this.shakeThresh) {
      this.shakeInterval = 0;
      if (Math.random() < deltaT / this.shakeThresh) {
        this.shakeThresh = this.shakeThresh - Math.random() * 250;
      }
      if (this.shakeDir) {
        this.sprite.style.top = this.y - this.shakeAmount;
        this.sprite.style.left = this.x - this.shakeAmount;
      } else {
        this.sprite.style.top = this.y + this.shakeAmount;
        this.sprite.style.left = this.x + this.shakeAmount;
      }
      this.shakeDir = !this.shakeDir;
      if (this.shakeThresh < 50 && Math.random() > 0.5) {
        this.fall();
        this.falling = true;
        //this.newIce(1);
      }
    }
  };

  collider = () => {
    this.hitbox = {
      xMax: this.x + SPIKE_WIDTH,
      xMin: this.x,
      yMax: this.y + SPIKE_HEIGHT,
      yMin: this.y
    };
  };

  fall = () => {
    this.y = this.y + this.moveSpeed;
    this.sprite.style.top = this.y;
    this.collider();
    if (this.y > GAME_HEIGHT) {
      this.cleanupFn(this.sprite);
      this.destroyFlag = true;
      this.ticking = false;
      return;
    }
    setTimeout(this.fall, 30);
  };
}
