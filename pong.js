// Has sounds for starting the game, when the ball hits a paddle, when a player scores a point, and when the game is over (a player has reached 5 points).
// Game ends when a player reaches 5 points.

//preload sounds
function preload() {
  soundFormats('mp3', 'ogg');
  // I also added a start sound
  startSound = loadSound('startgame.mp3');
  bounceSound = loadSound('bounce.mp3');
  pointSound = loadSound('point.mp3');
  gameoverSound = loadSound('gameover.mp3');
}

var GAMESTATE = 'START'; // 'PLAY', 'POINT', 'GAMEOVER'
var score = {
  player1: 0,
  player2: 0
}
var ball = {
  x: 2,
  y: 2,
  xvelocity: 2,
  yvelocity: 2,
  size: 20
}
var paddle1 = {
  x: 100,
  y: 100,
  width: 10,
  length: 80
}
var paddle2 = {
  x: 20,
  y: 20,
  width: 10,
  length: 80
}
var gameoversound, pointsound, osc;
var borders = {
  leftx: 0,
  rightx: 0,
  topy: 0,
  bottomy: 0
}
var keypress = {
  w: false, // up player 1 
  s: false, // down player 1
  i: false, // up player 2
  k: false, // down player 2
  spacebar: false // start signal for game 
}

// the preload function is empty for now.  this is where you can load mp3 
// sounds to play when the game state enters GAME OVER and POINT.  
// function preload() {
// }

function setup() {
  startSound.setVolume(0.2);
  createCanvas(400, 400);

  // i added some code here to initialize an oscillator!!!
  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(240);
  osc.amp(0);
  osc.start();
}

// this mainloop contains the three functions that do everything that our program will do
function draw() {
  checkInput(); // looks at the keyboard and logs the keys that are pressed
  updateState(); // transitions the program from state to state, and updates the data model
  drawStuff(); // displays the game elements (and produces the sounds)
}

// this function gathers input from the keyboard and saves
// it in our data structure so that the rest of the functions can 
// access it quickly
function checkInput() {
  // check is key w down?
  if (keyIsDown(87)) {
    keypress.w = true;
    print('w')
  } else {
    keypress.w = false;
  }
  if (keyIsDown(83)) {
    keypress.s = true;
    print('s')
  } else {
    keypress.s = false;
  }
  if (keyIsDown(73)) {
    keypress.i = true;
    print('i')
  } else {
    keypress.i = false;
  }
  if (keyIsDown(75)) {
    keypress.k = true;
    print('k')
  } else {
    keypress.k = false;
  }
  if (keyIsDown(32)) {
    keypress.spacebar = true;
    print('SPACEBAR')
  } else {
    keypress.spacebar = false;
  }
}

// this function updates the game state and the data that we use to simulate the game.
// it is the "logic" of the game.  
// Please modify this function so that the game 
// ENDS when one player reaches a particular score.
// and display text saying which player has won
function updateState() {
  if (GAMESTATE == 'START') {
    initializePositions();
    // wait for spacebar
    if (keypress.spacebar == true) {
      GAMESTATE = 'PLAY';
      startSound.play();
    }
  } else if (GAMESTATE == 'POINT') {
    initializePositions();
    if (keypress.spacebar == true) {
      GAMESTATE = 'PLAY';
      startSound.play();
    }
  } else if (GAMESTATE == 'GAMEOVER') {
    if (keypress.spacebar == true) {
      GAMESTATE = 'START';
      score.player1 = 0;
      score.player2 = 0;
    }
  } else if (GAMESTATE == 'PLAY') {
    // move ball 
    ball.x = ball.x + ball.xvelocity;
    ball.y = ball.y + ball.yvelocity;

    // move paddles.  you may want to modify this so that the paddles remain on the screen
    if (keypress.w == true) {
      paddle1.y = paddle1.y - 3;
    } else if (keypress.s == true) {
      paddle1.y = paddle1.y + 3;
    }
    if (keypress.i == true) {
      paddle2.y = paddle2.y - 3;
    } else if (keypress.k == true) {
      paddle2.y = paddle2.y + 3;
    }

    //   var paddleConstrained = constrain(paddle1.Y, borders.bottomy-80, borders.topy);
    // paddleConstrained();
    
    // check top/bottom boundaries and reverse yvelocity 
    // you may want to modify this so that the paddles remain on the screen
    // hint: what does the "constrain()" function do.
    if (ball.y < borders.topy + 4) {
      ball.yvelocity = -ball.yvelocity;
    }
    if (ball.y > borders.bottomy - 4) {
      ball.yvelocity = -ball.yvelocity;
    }

    // this checks if the ball goes out of bounds on the left or right.
    // if the paddle is there, the ball reverses direction but if its not
    // the other player gets a point and the gamestate changes.  you may want to change this 
    // so that the ball location that is used is the CENTER of the ball and not the upper left corner
    if (ball.x > borders.rightx - 4) {
      if ((ball.y > paddle2.y) &&
        (ball.y < (paddle2.y + paddle2.length))) {
        ball.xvelocity = -ball.xvelocity;
        print('bounce2');
        bounceSound.play();
      } else {
        score.player1 = score.player1 + 1;
        GAMESTATE = 'POINT';
        pointSound.play();
      }
        if (score.player1 == 5) {
          GAMESTATE = 'GAMEOVER';
        }
    }
    if (ball.x < borders.leftx + 4) {
      if ((ball.y > paddle1.y) &&
        (ball.y < (paddle1.y + paddle1.length))) {
        ball.xvelocity = -ball.xvelocity;
        print('bounce1');
        bounceSound.play();
      } else {
        score.player2 = score.player2 + 1;
        GAMESTATE = 'POINT';
        pointSound.play();
      }
        if (score.player2 == 5) {
          GAMESTATE = 'GAMEOVER';
          gameoverSound.play();
        }
    }
    
    // if ((score.player1 = 3) || (score.player2 = 3)) {
    //     GAMESTATE = 'GAMEOVER';
        // score.player1 = 0;
        // score.player2 = 0;
      }
    
  }

// "rendering" function, produces the output that the user will get... sounds and visuals 
// right now it only does the drawing!  
//
// you may want to update this so that it plays sounds  
// for ball bounces:  hint: i initialized an oscillator (osc) in setup for you. use millis() to log the 
// start time and turn the oscillator back off after a fixed duration of time has passed.   this may require
// some new variables to track the sound timing information  
//  
// may want to use preloaded sounds from mp3 files (which you load into variables gameoversound and  pointsound)
// and play them when the game enters a POINT or GAMEOVER state.  as with the ball bounce sound you 
// will want to track some state for the sound file, so that you dont keep starting it while waiting for the spacebar 
// to be pressed
// 
// you may also want to change the logic here so the ball does not 
// appear while you are waiting for the space bar to start the game play 
function drawStuff() {
  background(0);
  // draw paddles
  fill(255)

  push();
  fill(255, 173, 5)
  rect(paddle1.x, paddle1.y, paddle1.width,
    paddle1.length);
  rect(paddle2.x, paddle2.y, paddle2.width,
    paddle2.length);
  pop();
  // draw ball
  ellipse(ball.x, ball.y, ball.size);
  noStroke();
  // draw net
  // draw score
  text(score.player1, width / 4, 20);
  text(score.player2, 3 * width / 4, 20);

  push();
  noFill();
  strokeWeight(4);
  stroke(255);
  rect(borders.leftx, borders.topy,
    borders.rightx - borders.leftx,
    borders.bottomy - borders.topy);
  pop();

  if (GAMESTATE == 'START') {
    // text press spacebar to play
    textAlign(CENTER);
    text('Press SPACEBAR to Start', width / 2, height / 2 + 25);
    // text instruction
  } else if (GAMESTATE == 'PLAY') {} else if (GAMESTATE == 'POINT') {
    // play point sound
    textAlign(CENTER);
    text('Press SPACEBAR to Continue', width / 2, height / 2 + 25);
  } else if (GAMESTATE == 'GAMEOVER') {
    // play gamesound
    text('GAME OVER and WINNER! Press SPACEBAR to Restart')
    textAlign(CENTER);
    text('GAME OVER Press SPACEBAR to Restart', width / 2, height / 2 + 25);
  }
}


// this initializes the ball and paddle positions at the beginning of a point.  you
// should change this to randomize ball position and velocity each time so the game is more interesting!!
function initializePositions() {
  ball.x = width / 2;
  for (var i = 0; i < 100; i++) {
    ball.y = random(100, height - 50);

    // if (random(0, 1) < 0.25) {
    //   ball.xvelocity = random(-3, -0.01);
    //   ball.yvelocity = random(-3, -0.01);
    // }
    // if (0.25 < random(0, 1) < 0.5) {
    //   ball.xvelocity = random(-3, 0.01);
    //   ball.yvelocity = random(0.01, 3);
    // }
    // if (0.5 < random(0, 1) < 0.75) {
    //   ball.xvelocity = random(0.01, 3);
    //   ball.yvelocity = random(0.01, 3);
    // }
    // if (random(0, 1) > 0.75) {
    //   ball.xvelocity = random(0.01, 3);
    //   ball.yvelocity = random(-3, -0.01);
    //   }
    ball.xvelocity = (random(-3, 3));
    ball.yvelocity = (random(-3, 3));
  }

  borders.leftx = 50;
  borders.rightx = width - 50;
  borders.topy = 100;
  borders.bottomy = height - 50;

  paddle1.x = borders.leftx - paddle1.width;
  paddle1.y = height / 2 - 13;
  paddle2.x = borders.rightx;
  paddle2.y = height / 2 - 13;
}
