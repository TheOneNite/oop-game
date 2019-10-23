class Engine {
  constructor(app, level) {
    this.app = app;
    this.level = level;
    this.pawn = new Player(app, this.navCollision);
    this.avalanches = [];
    this.passedAvalanches = 0;
    this.levelIndex = 0;
    this.boulders = {};
    this.activeBoulders = [];
    this.ice = [];
    this.freshIce = [];
    this.centerOffset = 0;
  }

  beginPlay = () => {
    this.spawnTerrain();
    this.spawnIce(Math.floor((Math.random() + 0.5) * 10));
    this.drawTerrain(0);
    //this.centerApp();
    this.app.appendChild(this.pawn.sprite);
    this.pawn.tick();
    setTimeout(this.spawnAvalanche, 3000);
    this.collisionTracker();
    setInterval(this.collisionTracker, 30);
  };

  centerApp = () => {
    let xOffset = this.app.getBoundingClientRect();
    xOffset = Math.floor(xOffset.x);
    console.log(xOffset);
    this.centerOffset = xOffset;
    this.pawn.offset = this.centerOffset;
    this.pawn.center();
  };

  spawnAvalanche = () => {
    if (this.levelIndex > 2) {
      setTimeout(this.spawnAvalanche, 5000);
      return;
    }
    let paths = {};
    let safespot = 10;
    if (this.levelIndex === 0) {
      safespot = Math.floor(Math.random() * 4);
    }
    console.log("path" + safespot + "is safe");
    for (let i = 0; i < 4; i++) {
      if (i === safespot) {
        paths[i * ENEMY_WIDTH] = true;
      } else {
        paths[i * ENEMY_WIDTH] = false;
      }
    }
    let pathCoords = Object.keys(paths);
    pathCoords.forEach(xCoord => {
      if (paths[xCoord]) {
      } else {
        let newAva = new Avalanche(parseInt(xCoord), (ENEMY_HEIGHT - 50) * -1);
        this.avalanches.push(newAva);
      }
    });
    this.avalanches.forEach(ava => {
      this.app.appendChild(ava.sprite);
      setTimeout(ava.tick, 1000);
    });
    setTimeout(this.avalancheCleanup, 1030);
  };

  avalancheCleanup = () => {
    this.avalanches.forEach(ava => {
      if (ava.y - ENEMY_HEIGHT > GAME_HEIGHT && !ava.destroyFlag) {
        ava.destroyFlag = true;
      }
      if (ava.destroyFlag && ava.sprite.parentNode === this.app) {
        this.app.removeChild(ava.sprite);
        this.passedAvalanches++;
      }
    });
    if (this.avalanches.length === this.passedAvalanches) {
      this.avalanches = [];
      this.passedAvalanches = 0;
    } else {
      setTimeout(this.avalancheCleanup, 30);
      return;
    }
    let nextAvalanche = Math.random() * 5 * 1000;
    console.log("next avalanche in " + nextAvalanche);
    setTimeout(this.spawnAvalanche, nextAvalanche);
  };

  iceCollision = () => {
    this.ice.forEach(ice => {
      if (ice.falling) {
        if (this.pawn.hitbox.xMin < ice.hitbox.xMax) {
          if (this.pawn.hitbox.xMax > ice.hitbox.xMin) {
            if (this.pawn.hitbox.yMin < ice.hitbox.yMax) {
              if (this.pawn.hitbox.yMax < ice.hitbox.yMin) {
              } else {
                //window.alert("You Lose");
                console.log("ICE_COLLISION");
                this.loseGame();
              }
            }
          }
        }
      }
    });
  };

  navCollision = () => {
    for (let i = 0; i < this.activeBoulders.length; i++) {
      let rock = this.activeBoulders[i];
      if (rock.hitbox.xMin < this.pawn.hitbox.xMax) {
        if (rock.hitbox.xMax > this.pawn.hitbox.xMin) {
          if (rock.hitbox.yMin < this.pawn.hitbox.yMax) {
            if (rock.hitbox.yMax < this.pawn.hitbox.yMin) {
            } else {
              console.log("navBlocked");
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  collisionTracker = () => {
    this.iceCollision();
    this.avalanches.forEach(ava => {
      this.activeBoulders.forEach(rock => {
        if (rock.hitbox.xMin < ava.hitbox.xMax) {
          if (rock.hitbox.xMax > ava.hitbox.xMin) {
            if (rock.hitbox.yMin < ava.hitbox.yMax) {
              if (rock.hitbox.yMax < ava.hitbox.yMin) {
              } else {
                //console.log("HIT-A-ROCK");
                ava.tickFn = ava.blockedTick;
              }
            }
          }
        }
      });
      if (this.pawn.hitbox.xMin < ava.hitbox.xMax) {
        if (this.pawn.hitbox.xMax > ava.hitbox.xMin) {
          if (this.pawn.hitbox.yMin < ava.hitbox.yMax) {
            if (this.pawn.hitbox.yMax < ava.hitbox.yMin) {
            } else {
              //window.alert("You Lose");
              console.log("COLLISION");
              this.loseGame();
            }
          }
        }
      }
    });
  };

  chooseLane = () => {
    return 64 * Math.floor(Math.random() * 4);
  };

  spawnTerrain = () => {
    for (let lvli = 0; lvli < 5; lvli++) {
      let lvlBoulders = [];
      if (lvli < 3) {
        for (let i = 0; i < 2 + lvli; i++) {
          let xCoord = Math.floor(Math.random() * 4) * 64;
          let yCoord = (Math.random() + 0.1) * GAME_HEIGHT;
          let newBoulder = new Boulder(xCoord, yCoord);
          console.log(`lvl ${lvli} boulder @ (${xCoord}, ${yCoord}`);
          lvlBoulders.push(newBoulder);
        }
      }
      this.boulders[lvli] = lvlBoulders;
    }
  };
  drawTerrain = lvl => {
    this.activeBoulders.forEach(rock => {
      this.app.removeChild(rock.sprite);
    });
    if (lvl === 3) {
      this.drawIce();
    }
    this.activeBoulders = this.boulders[lvl];
    this.activeBoulders.forEach(rock => {
      this.app.appendChild(rock.sprite);
    });
  };

  spawnIce = numIce => {
    for (let i = 0; i < numIce; i++) {
      let xCoord = 30 * Math.floor(Math.random() * 8);
      let yCoord = Math.random() * GAME_HEIGHT - SPIKE_HEIGHT;
      let newIce = new Icicle(xCoord, yCoord, this.spawnIce, this.cleanIce);
      this.ice.push(newIce);
    }
  };

  drawIce = () => {
    this.ice.forEach(ice => {
      if (!ice.destroyFlag) {
        this.app.appendChild(ice.sprite);
        ice.ticking = true;
        ice.tick();
      }
    });
  };

  hideIce = () => {
    this.ice.forEach(ice => {
      if (!ice.destroyFlag) {
        ice.ticking = false;
        this.app.removeChild(ice.sprite);
      }
    });
  };

  cleanIce = sprite => {
    if (sprite.parentNode === this.app) {
      this.app.removeChild(sprite);
    }
  };

  summitAvalanche = () => {
    let xCoord = this.chooseLane();
    let yCoord = (Math.random() + 0.25) * GAME_HEIGHT;
    let summitAva = new Avalanche(xCoord, yCoord);
    summitAva.tickFn = summitAva.breakAway;
    summitAva.sprite.style.top = yCoord;
    summitAva.sprite.style.height = "10px";
    summitAva.height = 10;
    summitAva.collider();
    //summitAva.sprite.style.border = "1px solid red";
    this.app.appendChild(summitAva.sprite);
    this.avalanches.push(summitAva);
    setTimeout(summitAva.tick, (Math.random() * 5 + 5) * 1000);
  };

  loseGame = () => {
    this.avalanches = [];
    this.ice = [];
    this.app.innerHTML = "";
    //window.alert("You have lost");
  };
}
