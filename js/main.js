let level = document.createElement("img");
let app = document.getElementById("app");
let scoreBoard = document.getElementById("scoreBoard");
let heightCounter = document.createElement("div");
let timeCounter = document.createElement("h4");
let time = 0;
let timeStr = "0:00";
let meters = 0;
let levelIndex = 0;
let summited = false;
let levelAssets = [
  "./images/pngs/basecamp.png",
  "./images/pngs/stage1.png",
  "./images/pngs/stage2.png",
  "./images/pngs/icewall.png",
  "./images/pngs/summit.png"
];

let engine = new Engine(app, level);

let timer = () => {
  let mins = Math.floor(time / 60);
  let secs = time - mins * 60;
  if (secs < 10) {
    timeStr = "Time: " + mins + ":0" + secs;
  } else {
    timeStr = "Time: " + mins + ":" + secs;
  }
  timeCounter.innerText = timeStr;
};

let timeInc = () => {
  time++;
  timer();
};

let summitUI = () => {
  let summitNotify = document.createElement("div");
  summitNotify.innerText = "Summit Reached!";
  summitNotify.classList.add("scoreWrapper");
  summitNotify.style.zIndex = 5;
  summitNotify.style.position = "absolute";
  summitNotify.style.top = "50px";
  app.appendChild(summitNotify);
};

inputHandler = event => {
  event.preventDefault();
  if (event.code === "ArrowRight") {
    engine.pawn.moveRight();
  }
  if (event.code === "ArrowLeft") {
    engine.pawn.moveLeft();
  }
  if (event.code === "ArrowUp") {
    engine.pawn.moveUp();
    meters = meters + engine.pawn.moveSpeed;
    levelManager(true);
    heightCounter.innerText = "Height: " + meters + "m";
  }
  if (event.code === "ArrowDown") {
    engine.pawn.moveDown(false);
    levelManager(false);
    meters = meters - engine.pawn.moveSpeed;
    heightCounter.innerText = "Height: " + meters + "m";
  }
  if (event.code === "Space") {
    engine.pawn.rappelle();
    levelManager(false);
    meters = meters - 30;
    heightCounter.innerText = "Height: " + meters + "m";
  }
};

levelManager = ascending => {
  if (engine.pawn.hitbox.yMin < 5 && ascending) {
    if (levelIndex === 4) {
      engine.pawn.y = 5;
      if (!summited) {
        summited = true;
        summitUI();
        engine.spawnIce(Math.floor((Math.random() + 0.5) * 10));
      }
    } else {
      if (levelIndex === 3) {
        engine.hideIce();
        if (!summited) {
          let num = Math.floor(Math.random() + 3);
          for (let i = 0; i < num; i++) {
            engine.summitAvalanche();
          }
        }
      }
      levelIndex = levelIndex + 1;
      level.src = levelAssets[levelIndex];
      engine.drawTerrain(levelIndex);
      engine.pawn.y = GAME_HEIGHT - PLAYER_HEIGHT;
      engine.levelIndex = levelIndex;
    }
  }
  if (engine.pawn.hitbox.yMax > GAME_HEIGHT - PLAYER_HEIGHT && !ascending) {
    if (levelIndex === 0) {
      engine.pawn.y = GAME_HEIGHT - PLAYER_HEIGHT;
      if (summited) {
        window.alert("YOU WIN");
      }
    } else {
      console.log("previous level");
      if (levelIndex === 3) {
        engine.hideIce();
      }
      levelIndex = levelIndex - 1;
      level.src = levelAssets[levelIndex];
      engine.drawTerrain(levelIndex);
      engine.pawn.y = PLAYER_HEIGHT;
      engine.levelIndex = levelIndex;
    }
  }
};

level.src = "./images/pngs/basecamp.png";
level.style.height = GAME_HEIGHT + "px";
level.style.width = GAME_WIDTH + "px";
level.style.margin = "-10px";
level.style.zIndex = 0;
app.appendChild(level);
timeCounter.innerText = timeStr;
heightCounter.style.position = "absolute";
heightCounter.style.zIndex = 10;
heightCounter.style.top = "25px";
heightCounter.classList.add("scoreWrapper");
timeCounter.style.position = "absolute";
timeCounter.style.zIndex = 10;
timeCounter.style.top = 0;
timeCounter.style.left = GAME_WIDTH;
timeCounter.classList.add("scoreWrapper");
app.appendChild(heightCounter);
app.appendChild(timeCounter);
document.addEventListener("keydown", inputHandler);
engine.beginPlay();
setInterval(timeInc, 1000);
