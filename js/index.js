const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const bgImg = new Image();
bgImg.src = './images/road.png';
const obstacles = [];

// GAME FONCTIONNEMENT
const myGameArea = {
  start: function () {
    this.isGameOn = true;
    this.score = 0;
    this.frames = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext('2d');
    this.interval = setInterval(updateGame, 20);
  },
  clear: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },
  stop: function() {
    clearInterval(this.interval);
  }
};

// BACKGROUND SETUP AND REFRESH
const background = {
  img: bgImg,
  y: 0,
  speed: 1,

  move: function() {
    this.y += this.speed;
    this.y %= canvas.height;
  }, 

  draw: function() {
    ctx.drawImage(this.img, 0, this.y, canvas.width, canvas.height);
    ctx.drawImage(this.img, 0, this.y - canvas.height, canvas.width, canvas.height);
  }

}

// CLASSES COMPONENTS
class gameComponent {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.h = h; 
    this.w = w;
    this.speedX = 0;
    this.speedY = 0;
  }

  update() {

    ctx.fillStyle = this.color;

    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
    } else {
      ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.h;
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.w;
  }
}

class Car extends gameComponent {
  constructor(x, y, w, h, img) {
    super(x, y, w, h);
    const componentImg = new Image();
    componentImg.src = img
    this.img = componentImg;
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  checkImpact(obstacle) {

    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.left() > obstacle.right() - 5 ||
      this.right() < obstacle.left() + 5
    );
    
  }
}

class Obstacle extends gameComponent {
  constructor(x, y, w, h, color) {
    super(x, y, w, h);
    this.color = color;
  }
}

const player = new Car(canvas.width/2 - 50, canvas.height - 100, 100, 201, './images/car.png');

// LET'S MAKE IT WORK
function updateGame() {
  myGameArea.clear();
  updateBackground();
  player.move();
  player.update();
  updateObstacles();
  checkGameOver();
  updateScore()
}

function updateBackground() {
  background.move();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
}

// GENERATE OBSTACLES
const updateObstacles = function() {

  for (i = 0; i < obstacles.length; i++) {
    obstacles[i].y += 1;
    obstacles[i].update();
  }
  
  myGameArea.frames++;
  
  if ( myGameArea.frames % 280 === 0 ) {
    const height = 20;
    let width = Math.floor(Math.random() * (canvas.width - 200 - 120) + 120);
    const x = Math.floor(Math.random() * (canvas.width));
    if (x > canvas.width - 100) { x -= canvas.width; }
    obstacles.push(new Obstacle(x, 0, width, height, 'darkred'));
  }

}

function checkGameOver() {
  let crashed = obstacles.some((obstacle) => player.checkImpact(obstacle) );
  console.log(crashed)
  if (crashed) {
    alert(`BOOOOOMM!\nYour score is ${myGameArea.score}`)
    myGameArea.isGameOn = false;
    myGameArea.stop();
  }
}

function updateScore() {
  
  myGameArea.score = Math.floor(myGameArea.frames / 5);
  ctx.fillStyle = 'black';
  ctx.font = '30px Arial';
  ctx.fillText(myGameArea.score, canvas.width - 100,50);

}


window.onload = () => {
  document.getElementById('start-button').onclick = () => startGame();

  function startGame() {
    if (!myGameArea.isGameOn) { myGameArea.start(); }
  }

  document.addEventListener('keydown', (e) => {
  switch(e.keyCode) {
    case 32:
      startGame()
      break;
    case 38:
      if (player.top() <= 0) {
        player.speedY = 0;
        break;
      }
      player.speedY -= 1;
      break;
    case 40:
      if (player.bottom() >= canvas.height) {
        player.speedY = 0;
        break;
      }
      player.speedY += 1;
      break;
    case 37:
      if (player.left() <= 0) {
        player.speedX = 0;
        break;
      }
      player.speedX -= 1;
      break;
    case 39:
      if (player.right() >= canvas.width) {
        player.speedX = 0;
        break;
      }
      player.speedX += 1;
      break;
  }

  });

  document.addEventListener('keyup', (e) => {
    player.speedX = 0;
    player.speedY = 0;
  });




};
