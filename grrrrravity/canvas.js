const canvas = document.getElementById('createAndResize');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .8;

const context = canvas.getContext('2d');
// context.globalCompositeOperation  = 'soft-light';
const NUM_CIRCLES = 700;

const mouse = {
  x: undefined,
  y: undefined
};

const config = {
  gravity: 1,
  friction: 0.8,
  MAX_BALLS: 90,
}

class Ball {
  constructor({x, y, radius, xVelocity, yVelocity, color}) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.yVelocity = yVelocity;
    this.xVelocity = xVelocity;
    this.deadBounces = 0;
    this.friction = random(.6, .99)
  }

  update = () => {
    if(this.deadBounces > 5) {
      this.y = context.canvas.height - this.radius;
      return true
    }
    if(this.y > context.canvas.height - this.radius) {
      this.yVelocity = -this.yVelocity * config.friction; // reverse the velocity (make ball go back up)
      if(this.y + this.yVelocity > context.canvas.height - this.radius) { // if it doesn't make it all the way back up
        this.y = context.canvas.height - this.radius;
        this.deadBounces++
      }
    } else {
      // speed up on the way down
      // slow down on the way up and eventually it will start going down again
      this.yVelocity += config.gravity;
    }

    if(this.x > context.canvas.width - this.radius || this.x < 0 + this.radius) { // if goes off the right
      this.xVelocity = -this.xVelocity;
      if(this.x + this.xVelocity > context.canvas.width - this.radius) {
        this.x = context.canvas.width - this.radius
      }
      if(this.x + this.xVelocity < 0 + this.radius) {
        this.x = 0 - this.radius
      }      
    }
    // if(this.y + this.yVelocity + this.radius > context.canvas.height) { // if it is below the canvas
    //   this.y = context.canvas.height - this.radius; // make sure it's just on the bottom
    // }

    this.x += this.xVelocity;
    this.y += this.yVelocity;
  }

  draw = (context) => {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    const gradient = context.createRadialGradient(
      this.x, 
      this.y,
      this.radius, 
      this.x - (this.radius * .5), 
      this.y - (this.radius * .5), 
      // this.radius
      .5
    );
    gradient.addColorStop(0, this.color)
    gradient.addColorStop(.9, 'white')
    // gradient.addColorStop(1, 'green');
    context.fillStyle = gradient; //this.color;
    context.fill()
    context.closePath();
  }

}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x
  mouse.y = e.y
});


tropicalFishPalette = [
  '#0D0D0D',
  '#A68B03',
  '#4227F2',
  '#2405F2',
  '#6503A6',
];

const random = ( min, max ) => (
	Math.random() * ( max - min ) + min
);

const randomColor = (colorPalette = tropicalFishPalette) => (
  colorPalette[Math.floor(Math.random() * colorPalette.length)]
);

const newBall = () => {
  const randomY = random(context.canvas.height * .1, context.canvas.height * Math.random() * .6)
  const ball = new Ball({
  x: context.canvas.width * Math.random(), 
  y: randomY, 
  radius: Math.random() * 40, 
  yVelocity: Math.random() * 9, 
  xVelocity: random(-2, 2),
  color: randomColor()
})
  return ball 
};
const ball = new Ball({x: context.canvas.width / 2, y: context.canvas.height / 2, radius: 30, yVelocity: 2, color: 'red'});

let balls = [];

const init = () => {
  for(let i = 0; i < config.MAX_BALLS; i++) {
    const daball = newBall()
    balls.push(daball)
  }
}

window.addEventListener('resize', (e) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * .8;
  init();
})

const animate = () => {
  requestAnimationFrame(animate);
  context.clearRect(0,0,context.canvas.width, context.canvas.height);
  for(const ball of balls) {
    ball.update()
    ball.draw(context);
  }

}

animate();
init();