const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const bgImg = new Image();
bgImg.src = './images/road.png';
const obstacles = [];


const myGameArea = {
  start: function () {
    this.isGameOn = true;
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

const background = {
  img: bgImg,
  y: 0,
  speed: 1,

  move: function() {
    this.y += this.speed;
    this.y %= this.img.height;
  }, 

  draw: function() {
    ctx.drawImage(this.img, 0, this.y);
    ctx.drawImage(this.img, 0, this.y + this.img.height);
    ctx.drawImage(this.img, 0, this.y - this.img.height );
  }

}

class gameComponent {
  constructor(x, y, w, h, color, img) {
    this.x = x;
    this.y = y;
    this.h = h; 
    this.w = w;
    this.speedX = 0;
    this.speedY = 0;
    this.color = color;

    if (img) {
      const componentImg = new Image();
      componentImg.src = img
      this.img = componentImg;
    }
  }

  update() {

    ctx.fillStyle = this.color;

    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
    } else {
      ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
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

  checkImpact(obstacle) {

    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.left() > obstacle.right() - 5 ||
      this.right() < obstacle.left() + 5
    );
    
  }
}

const player = new gameComponent(100, canvas.height - 200, 80, 150, 'transparent', './images/car.png');

function updateGame() {
  myGameArea.clear();
  updateCanvas();
  player.move();
  player.update();
  updateObstacles();
  checkGameOver();
  updateScore()
}

function updateCanvas() {
  background.move();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
}

const updateObstacles = function() {

  for (i = 0; i < obstacles.length; i++) {
    obstacles[i].y += 1;
    obstacles[i].update();
  }
  
  myGameArea.frames++;
  
  // generate new obstacle
  if ( myGameArea.frames % 200 === 0 ) {
    const height = 20;
    let width = Math.floor(Math.random() * (bgImg.width - 160 - 120) + 120);
    const x = Math.floor(Math.random() * bgImg.width - width);
    obstacles.push(new gameComponent(x, 0, width, height, 'darkred', false));
  }

}

function checkGameOver() {
  let crashed = obstacles.some((obstacle) => player.checkImpact(obstacle) );
  console.log(crashed)
  if (crashed) {
    myGameArea.stop();
  }
}

function updateScore() {
  
  const score = Math.floor(myGameArea.frames / 5);
  ctx.fillStyle = 'black';
  ctx.font = '30px Arial';
  ctx.fillText(score, canvas.width - 100,50);

}


window.onload = () => {
  document.getElementById('start-button').onclick = () => startGame();

  function startGame() {
    if (!myGameArea.isGameOn) { myGameArea.start(); }
  }

  document.addEventListener('keydown', (e) => {
  switch(e.keyCode) {
    // case 65:
    //   console.log(`Si player est dans une des zones autour de l'obstacle :
    //   Player top ${player.top()} > obs bottom ${obstacles[0].bottom()} --> ${player.top() > obstacles[0].bottom()}
    //   Payer bottom ${player.bottom()} > obs top ${obstacles[0].top()} --> ${player.bottom() > obstacles[0].top()}
    //   Player left ${player.left()} > obs right ${obstacles[0].right()} --> ${player.left() > obstacles[0].right()}
    //   Player right ${player.right()} < à obs left ${obstacles[0].left()} --> ${player.right() < obstacles[0].left()}
    //   `);
    //   // console.log('x', obstacles[0].x, 'y', obstacles[0].y, 'width', obstacles[0].w, 'height', obstacles[0].h)
    //   myGameArea.stop()
    //   break
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
      if (player.right() >= bgImg.width) {
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
