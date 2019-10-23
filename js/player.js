class Player {
  collider = () => {
    this.hitbox = {
      xMax: this.x + PLAYER_WIDTH,
      xMin: this.x,
      yMax: this.y + PLAYER_HEIGHT,
      yMin: this.y
    };
    //console.log("xMax" + this.hitbox.xMax);
    // console.log("xMin" + this.hitbox.xMin);
    //console.log("yMax" + this.hitbox.yMax);
    //console.log("yMin" + this.hitbox.yMin);
  };

  tick = () => {
    this.sprite.style.left = this.x + "px";
    this.sprite.style.top = this.y + "px";
    setTimeout(this.tick, 30);
  };

  moveUp = () => {
    let oldY = this.y;
    this.y = this.y - this.moveSpeed;
    this.collider();
    if (this.navCheck()) {
      this.y = oldY;
      this.collider();
    }
  };
  moveDown = () => {
    let oldY = this.y;
    this.y = this.y + this.moveSpeed;
    this.collider();
    if (this.navCheck()) {
      this.y = oldY;
      this.collider();
    }
  };
  moveRight = () => {
    let oldX = this.x;
    this.x = this.x + this.moveSpeed;
    if (this.x > GAME_WIDTH + this.offset - PLAYER_WIDTH) {
      this.x = GAME_WIDTH + this.offset - PLAYER_WIDTH;
    }
    this.collider();
    if (this.navCheck()) {
      this.x = oldX;
      this.collider();
    }
  };
  moveLeft = () => {
    let oldX = this.x;
    this.x = this.x - this.moveSpeed;
    if (this.x < this.offset) {
      this.x = this.offset;
    }
    this.collider();
    if (this.navCheck()) {
      this.x = oldX;
      this.collider();
    }
  };

  center = () => {
    this.x = this.x + this.offset;
  };

  constructor(root, navCheck) {
    this.root = root;
    this.sprite = document.createElement("img");
    this.moveSpeed = 10;
    this.y = GAME_HEIGHT - PLAYER_HEIGHT;
    this.x = GAME_WIDTH / 2;
    this.sprite.src = "./images/pngs/climber.png";
    this.sprite.style.height = PLAYER_HEIGHT + "px";
    this.sprite.style.width = PLAYER_WIDTH + "px";
    this.sprite.style.position = "absolute";
    this.sprite.style.zIndex = 1;
    this.navCheck = navCheck;
    this.offset = 0;
    this.hitbox = {
      xMax: this.x + PLAYER_WIDTH,
      xMin: this.x,
      yMax: this.y + PLAYER_HEIGHT,
      yMin: this.y
    };
  }
}
