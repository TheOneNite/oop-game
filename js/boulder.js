class Boulder {
  constructor(xCoord, yCoord) {
    this.sprite = document.createElement("img");
    this.sprite.src = "./images/pngs/rock.png";
    this.width = BOULDER_WIDTH;
    this.height = BOULDER_HEIGHT;
    this.sprite.style.width = this.width;
    this.sprite.style.height = this.height;
    this.sprite.style.zIndex = 10;
    this.x = xCoord;
    this.y = yCoord;
    this.sprite.style.position = "absolute";
    this.sprite.style.top = this.y;
    this.sprite.style.left = this.x;
    this.sprite.style.border = "1px solid red";
    this.hitbox = {
      xMax: this.x + BOULDER_WIDTH,
      xMin: this.x,
      yMax: this.y + BOULDER_HEIGHT,
      yMin: this.y
    };
  }
}
