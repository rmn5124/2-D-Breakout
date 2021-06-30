// SELECT CANVAS ELEMENT
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");

// ADD BORDER TO CANVAS
// cvs.style.border = "1px solid #0ff";

// MAKE LINE THIK WHEN DRAWING TO CANVAS
ctx.lineWidth = 3;

//ROUND RECT
CanvasRenderingContext2D.prototype.roundRect = function (
  x,
  y,
  width,
  height,
  radius
) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
  return this;
};

// GAME VARIABLES AND CONSTANTS
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 8;
let LIFE = 3; // PLAYER HAS 3 LIVES
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 5;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;
const ongoingTouches = [];
let DRAW_LIFE = true;

// CREATE THE PADDLE
const paddle = {
  x: cvs.width / 2 - PADDLE_WIDTH / 2,
  y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dx: 5,
};

//CREATE OBSTACLE
const obstacle1 = {
  x: cvs.width / 2 - 180,
  y: cvs.height - PADDLE_MARGIN_BOTTOM - 300,
  width: 70,
  height: PADDLE_HEIGHT,
  dx: 5,
};
const obstacle2 = {
  x: cvs.width / 2 + 100,
  y: cvs.height - PADDLE_MARGIN_BOTTOM - 250,
  width: 70,
  height: PADDLE_HEIGHT,
  dx: 5,
};

function drawObstacle1() {
  ctx.roundRect(
    obstacle1.x,
    obstacle1.y,
    obstacle1.width,
    obstacle1.height,
    25
  );
  ctx.fillStyle = "#CC00FF";
  ctx.fill();
}
function drawObstacle2() {
  ctx.roundRect(
    obstacle2.x,
    obstacle2.y,
    obstacle2.width,
    obstacle2.height,
    25
  );
  ctx.fillStyle = "#CC00FF";
  ctx.fill();
}
function obstacle1PaddleCollision() {
  if (
    ball.x + ball.radius > obstacle1.x &&
    ball.x - ball.radius < obstacle1.x + obstacle1.width &&
    ball.y + ball.radius > obstacle1.y &&
    ball.y - ball.radius < obstacle1.y + brick.height
  ) {
    BRICK_HIT.play();
    ball.dy = -ball.dy;
  }
}

function obtacle1ball() {
  if (
    ball2.x + ball2.radius > obstacle1.x &&
    ball2.x - ball2.radius < obstacle1.x + obstacle1.width &&
    ball2.y + ball2.radius > obstacle1.y &&
    ball2.y - ball2.radius < obstacle1.y + brick.height
  ) {
    BRICK_HIT.play();
    ball2.dy = -ball2.dy;
  }
}

function obtacle2ball() {
  if (
    ball2.x + ball2.radius > obstacle2.x &&
    ball2.x - ball2.radius < obstacle2.x + obstacle2.width &&
    ball2.y + ball2.radius > obstacle2.y &&
    ball2.y - ball2.radius < obstacle2.y + brick.height
  ) {
    BRICK_HIT.play();
    ball2.dy = -ball2.dy;
  }
}

function obstacle2PaddleCollision() {
  if (
    ball.x + ball.radius > obstacle2.x &&
    ball.x - ball.radius < obstacle2.x + obstacle2.width &&
    ball.y + ball.radius > obstacle2.y &&
    ball.y - ball.radius < obstacle2.y + brick.height
  ) {
    BRICK_HIT.play();
    ball.dy = -ball.dy;
  }
}

function ballBrickCollision() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick isn't broken
      if (b.status) {
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          BRICK_HIT.play();
          ball.dy = -ball.dy;
          b.status = false; // the brick is broken
          SCORE += SCORE_UNIT;
        }
      }
    }
  }
}
function drawPaddle() {
  if (LEVEL < 5) {
    ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 25);
    ctx.fillStyle = "#A7BBC7";
    ctx.fill();
  } else {
    ctx.roundRect(paddle.x, paddle.y, paddle.width - 40, paddle.height, 25);
    ctx.fillStyle = "#A7BBC7";
    ctx.fill();
  }

  // ctx.strokeStyle = "#ffcd05";
  // ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// CONTROL THE PADDLE
document.addEventListener("keydown", function (event) {
  if (event.keyCode == 37) {
    leftArrow = true;
  } else if (event.keyCode == 39) {
    rightArrow = true;
  }
});
document.addEventListener("keyup", function (event) {
  if (event.keyCode == 37) {
    leftArrow = false;
  } else if (event.keyCode == 39) {
    rightArrow = false;
  }
});

// HANDLER FOR TOUCH START EVENT
function handleStart(evt) {
  evt.preventDefault();
  let touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    ongoingTouches.push(copyTouch(touches[i]));
  }
}

// PADDLE CONTROL WITH TOUCHPAD
const setTouchEvents = () => {
  cvs.addEventListener("touchstart", handleStart, false);
  cvs.addEventListener("touchmove", handleMove, false);
  cvs.addEventListener("touchcancel", handleCancel, false);
  cvs.addEventListener("touchend", handleEnd, false);
};

document.addEventListener("DOMContentLoaded", setTouchEvents);

// MOVE PADDLE
function movePaddle() {
  if (rightArrow && paddle.x + paddle.width < cvs.width) {
    paddle.x += paddle.dx;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}

// CREATE THE BALL
const ball = {
  x: cvs.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 4,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3,
};

//Ball 2
const ball2 = {
  x: cvs.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 4,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3,
};

function drawBall2() {
  ctx.beginPath();

  ctx.arc(ball2.x, ball2.y, ball2.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffcd05";
  ctx.fill();

  ctx.strokeStyle = "#2e3548";
  ctx.stroke();

  ctx.closePath();
}

function moveBall2() {
  ball2.x += ball2.dx;
  ball2.y += ball2.dy;
}

function ball2WallCollision() {
  if (ball2.x + ball2.radius > cvs.width || ball2.x - ball2.radius < 0) {
    ball2.dx = -ball2.dx;
    WALL_HIT.play();
  }

  if (ball2.y - ball2.radius < 0) {
    ball2.dy = -ball2.dy;
    WALL_HIT.play();
  }

  if (ball2.y + ball2.radius > cvs.height) {
    LIFE--; // LOSE LIFE
    LIFE_LOST.play();
    resetBall2();
  }
}

function resetBall2() {
  ball2.x = cvs.width / 2;
  ball2.y = paddle.y - BALL_RADIUS;
  ball2.dx = 3 * (Math.random() * 2 - 1);
  ball2.dy = -3;
  paddle.x = cvs.width / 2 - PADDLE_WIDTH / 2;
  paddle.y = cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT;
  paddle.width = PADDLE_WIDTH;
  paddle.height = PADDLE_HEIGHT;
  paddle.dx = 5;
}

function ball2PaddleCollision() {
  if (
    ball2.x < paddle.x + paddle.width &&
    ball2.x > paddle.x &&
    paddle.y < paddle.y + paddle.height &&
    ball2.y > paddle.y
  ) {
    // PLAY SOUND
    PADDLE_HIT.play();

    // CHECK WHERE THE BALL HIT THE PADDLE
    let collidePoint = ball2.x - (paddle.x + paddle.width / 2);

    // NORMALIZE THE VALUES
    collidePoint = collidePoint / (paddle.width / 2);

    // CALCULATE THE ANGLE OF THE BALL
    let angle = (collidePoint * Math.PI) / 3;

    ball2.dx = ball.speed * Math.sin(angle);
    ball2.dy = -ball.speed * Math.cos(angle);
  }
}

function ball2BrickCollision() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick isn't broken
      if (b.status) {
        if (
          ball2.x + ball2.radius > b.x &&
          ball2.x - ball2.radius < b.x + brick.width &&
          ball2.y + ball2.radius > b.y &&
          ball2.y - ball2.radius < b.y + brick.height
        ) {
          BRICK_HIT.play();
          ball2.dy = -ball2.dy;
          b.status = false; // the brick is broken
          SCORE += SCORE_UNIT;
        }
      }
    }
  }
}

function ball2play() {
  drawBall2();
  moveBall2();

  ball2PaddleCollision();
  // resetBall2()
  ball2WallCollision();
  ball2BrickCollision();
}

//LIFELINE
const life = {
  x: (cvs.width / 2) * Math.random() * 2,
  y: 0,
  radius: BALL_RADIUS + 3,
  speed: 5,
  dx: 3 * (Math.random() * 2 - 1),
  dy: 3,
  status: true,
};

// DRAW THE BALL
function drawBall() {
  ctx.beginPath();

  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#FF8585";
  ctx.fill();

  ctx.strokeStyle = "#2e3548";
  ctx.stroke();

  ctx.closePath();
}

//DRAW LIFE
function drawLife() {
  if (DRAW_LIFE == true) {
    ctx.beginPath();

    ctx.arc(life.x, life.y, life.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#00FF33";
    ctx.fill();

    ctx.strokeStyle = "#00FF66";
    ctx.stroke();

    ctx.closePath();
  }
}

// MOVE THE BALL
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

//MOVE LIFE
function moveLife() {
  life.y += life.dy;
}

// BALL AND WALL COLLISION DETECTION
function ballWallCollision() {
  if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
    WALL_HIT.play();
  }

  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
    WALL_HIT.play();
  }

  if (ball.y + ball.radius > cvs.height) {
    LIFE--; // LOSE LIFE
    LIFE_LOST.play();
    resetBall();
  }
}

// RESET THE BALL
function resetBall() {
  ball.x = cvs.width / 2;
  ball.y = paddle.y - BALL_RADIUS;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
  paddle.x = cvs.width / 2 - PADDLE_WIDTH / 2;
  paddle.y = cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT;
  paddle.width = PADDLE_WIDTH;
  paddle.height = PADDLE_HEIGHT;
  paddle.dx = 5;
}

function resetLife() {
  life.x = (cvs.width / 2) * Math.random() * 2;
  life.y = 0;
  life.dx = 3 * (Math.random() * 2 - 1);
  life.dy = 3;
  DRAW_LIFE = true;
}

// BALL AND PADDLE COLLISION
function ballPaddleCollision() {
  if (
    ball.x < paddle.x + paddle.width &&
    ball.x > paddle.x &&
    paddle.y < paddle.y + paddle.height &&
    ball.y > paddle.y
  ) {
    // PLAY SOUND
    PADDLE_HIT.play();

    // CHECK WHERE THE BALL HIT THE PADDLE
    let collidePoint = ball.x - (paddle.x + paddle.width / 2);

    // NORMALIZE THE VALUES
    collidePoint = collidePoint / (paddle.width / 2);

    // CALCULATE THE ANGLE OF THE BALL
    let angle = (collidePoint * Math.PI) / 3;

    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
}

// LIFE AND PADDLE COLLISION
function lifeCollision() {
  if (
    life.x < paddle.x + paddle.width &&
    life.x > paddle.x &&
    paddle.y < paddle.y + paddle.height &&
    life.y > paddle.y
  ) {
    // PLAY SOUND
    PADDLE_HIT.play();
    // CHECK WHERE THE BALL HIT THE PADDLE
    let collidePoint = life.x - (paddle.x + paddle.width / 2);

    // NORMALIZE THE VALUES
    collidePoint = collidePoint / (paddle.width / 2);

    // CALCULATE THE ANGLE OF THE BALL
    let angle = (collidePoint * Math.PI) / 3;

    life.dx = life.speed * Math.sin(angle);
    life.dy = -life.speed * Math.cos(angle);
    DRAW_LIFE = false;
    //CONDITION TO INCREMENT LIFE
    if (
      life.y + life.radius >
      cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT
    ) {
      // LIFE++;
      // SCORE += 30;
      // ball.radius += 3;

      //LEVEL 1
      //LEVEL 2 -
      if (LEVEL === 2) {
        ball.radius = 11;
        SCORE += 15;
      }
      //LEVEL 3 - ball.radius
      else if (LEVEL === 3) {
        ball.radius = 8;
        SCORE += 40;
      }
      //LEVEL 4 - LIFE
      else if (LEVEL === 4) {
        LIFE++;
        if (LIFE > 5) LIFE = 5;
      }
      //LEVEL 5 -
      else if (LEVEL === 5) {
        ball.radius = 5;
        ball2.radius = 5;
      }
    }
    resetLife();
  }
}

// CREATE THE BRICKS
const brick = {
  row: 1,
  column: 7,
  width: 55,
  height: 20,
  offSetLeft: 13,
  offSetTop: 10,
  marginTop: 40,
  fillColor: "#00FFFF",
  strokeColor: "#fff",
  // fillColorRock: "red",
};

let bricks = [];

function createBricks() {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y:
          r * (brick.offSetTop + brick.height) +
          brick.offSetTop +
          brick.marginTop,
        status: true,
      };
    }
  }
}

createBricks();

// draw the bricks
function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick isn't broken
      // const rockIndex=Math.floor(brick.row * (Math.random() * 2 - 1)),

      if (b.status) {
        //   if(bricks[r][c]===rockIndex)
        //   ctx.fillStyle=brick.fillColorRock;
        //   else

        // ctx.fillRect(b.x, b.y, brick.width, brick.height);
        ctx.roundRect(b.x, b.y, brick.width, brick.height, 15);
        ctx.fillStyle = brick.fillColor;
        ctx.fill();
        // ctx.strokeStyle = brick.strokeColor;
        // ctx.strokeRect(b.x, b.y, brick.width, brick.height);
      }
    }
  }
}

// ball brick collision
function ballBrickCollision() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick isn't broken
      if (b.status) {
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          BRICK_HIT.play();
          ball.dy = -ball.dy;
          b.status = false; // the brick is broken
          SCORE += SCORE_UNIT;
        }
      }
    }
  }
}

// show game stats
function showGameStats(text, textX, textY, img, imgX, imgY) {
  // draw text
  ctx.fillStyle = "#FFF";
  ctx.font = "25px Germania One";
  ctx.fillText(text, textX, textY);

  // draw image
  ctx.drawImage(img, imgX, imgY, (width = 25), (height = 25));
}

// DRAW FUNCTION
function draw() {
  drawPaddle();

  if (LEVEL === 3 || LEVEL === 4 || LEVEL === 5) {
    drawObstacle1();
    drawObstacle2();
  }

  drawBall();
  drawBricks();

  if (LEVEL > 1) drawLife();

  // SHOW SCORE
  showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
  // SHOW LIVES
  showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width - 55, 5);
  // SHOW LEVEL
  showGameStats(LEVEL, cvs.width / 2, 25, LEVEL_IMG, cvs.width / 2 - 30, 5);
}

// game over
function gameOver() {
  if (LIFE <= 0) {
    showYouLose();
    GAME_OVER = true;
  }
}

// level up
function levelUp() {
  let isLevelDone = true;

  // check if all the bricks are broken
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      isLevelDone = isLevelDone && !bricks[r][c].status;
    }
  }

  if (isLevelDone) {
    WIN.play();

    if (LEVEL >= MAX_LEVEL) {
      showYouWin();
      GAME_OVER = true;
      return;
    }

    brick.row++;
    createBricks();
    ball.speed += 0.5;
    resetBall();
    resetBall2();
    resetLife();
    LEVEL++;
  }
}

// UPDATE GAME FUNCTION
function update() {
  movePaddle();

  moveBall();

  moveLife();

  if (LEVEL === 3 || LEVEL === 4 || LEVEL === 5) {
    obtacle1ball();
    obtacle2ball();
    obstacle1PaddleCollision();
    obstacle2PaddleCollision();
  }

  ballWallCollision();

  ballPaddleCollision();

  // obstacle1PaddleCollision();
  // obstacle2PaddleCollision();

  lifeCollision();

  ballBrickCollision();

  gameOver();

  levelUp();
}

// GAME LOOP
function loop() {
  // CLEAR THE CANVAS
  ctx.drawImage(BG_IMG, 0, 0);
  GAME_SOUND.play();

  draw();

  if (LEVEL === 4 || LEVEL === 5) {
    ball2play();
  }

  update();

  if (!GAME_OVER) {
    requestAnimationFrame(loop);
  }
}
loop();

// SELECT SOUND ELEMENT
const soundElement = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager() {
  // CHANGE IMAGE SOUND_ON/OFF
  let imgSrc = soundElement.getAttribute("src");
  let SOUND_IMG =
    imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";

  soundElement.setAttribute("src", SOUND_IMG);

  // MUTE AND UNMUTE SOUNDS
  WALL_HIT.muted = WALL_HIT.muted ? false : true;
  PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
  BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
  WIN.muted = WIN.muted ? false : true;
  LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
  GAME_SOUND.muted = GAME_SOUND.muted ? false : true;
}

// SHOW GAME OVER MESSAGE
/* SELECT ELEMENTS */
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function () {
  location.reload(); // reload the page
});

// SHOW YOU WIN
function showYouWin() {
  gameover.style.display = "block";
  youwon.style.display = "block";
}

// SHOW YOU LOSE
function showYouLose() {
  gameover.style.display = "block";
  youlose.style.display = "block";
}

// PADDLE CONTROLS WITH MOUSE
document.addEventListener("mousemove", mouseMoveHandler, false);
// document.addEventListener("click", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  const relativeX = e.clientX - cvs.offsetLeft;
  if (relativeX >= 0 && relativeX <= cvs.width) {
    const newX = relativeX - paddle.width / 2;
    if (newX < 0) {
      paddle.x = 0;
    } else if (newX + paddle.width > cvs.width) {
      paddle.x = cvs.width - paddle.width;
    } else {
      paddle.x = newX;
    }
  }
}

// PADDLE CONTROLS WITH TOUCH
cvs.addEventListener("touchstart", handleStart, false);
cvs.addEventListener("touchmove", handleMove, false);

function handleStart(e) {
  e.preventDefault();
  let touchX = e.changedTouches[0].pageX - rect.left;
  movePaddleOnTouch(touchX);
}

function handleMove(e) {
  e.preventDefault();
  let touchX = e.changedTouches[0].pageX - rect.left;
  movePaddleOnTouch(touchX);
}

// MOVE PADDLE BY TOUCH
const movePaddleOnTouch = (touchX) => {
  if (touchX >= 0 && touchX <= cvs.width) {
    const newX = touchX - paddle.width / 2;
    if (newX < 0) {
      paddle.x = 0;
    } else if (newX + paddle.width > cvs.width) {
      paddle.x = cvs.width - paddle.width;
    } else {
      paddle.x = newX;
    }
  }
};
