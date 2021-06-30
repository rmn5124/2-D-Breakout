/////// LOAD IMAGES ////////

// LOAD BG IMAGE
const BG_IMG = new Image();
BG_IMG.src =
  "https://i0.wp.com/css-tricks.com/wp-content/uploads/2020/11/css-gradient.png?fit=1200%2C600&ssl=1";

const LEVEL_IMG = new Image();
LEVEL_IMG.src = "img/success.png";

const LIFE_IMG = new Image();
LIFE_IMG.src = "img/life-insurance.png";

const SCORE_IMG = new Image();
SCORE_IMG.src = "img/medal.png";

/////// END LOAD IMAGES ////////

// ************************ //

/////// LOAD SOUNDS ////////

const WALL_HIT = new Audio();
WALL_HIT.src = "sounds/wall.mp3";

const LIFE_LOST = new Audio();
LIFE_LOST.src = "sounds/life_lost.mp3";

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "sounds/paddle_hit.mp3";

const WIN = new Audio();
WIN.src = "sounds/win.mp3";

const BRICK_HIT = new Audio();
BRICK_HIT.src = "sounds/brick_hit.mp3";

const GAME_SOUND = new Audio();
GAME_SOUND.src = "sounds/music.mp3";

/////// END LOAD SOUNDS ////////
