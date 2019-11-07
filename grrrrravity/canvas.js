const canvas = document.getElementById('createAndResize');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .8;

const context = canvas.getContext('2d');
context.globalCompositeOperation  = 'soft-light';
const NUM_CIRCLES = 700;

const mouse = {
  x: undefined,
  y: undefined
};

const config = {
  gravity: 1,
  friction: 0.8,
}

class Ball {
  constructor(x, y, radius, yVelocity, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.yVelocity = yVelocity;
  }

  update = () => {
    if(this.y > context.canvas.height - this.radius) {
      this.yVelocity = -this.yVelocity * config.friction;
    } else {
      this.yVelocity += config.gravity;
    }
    this.y += this.yVelocity;
  }

  draw = (context) => {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill()
    context.closePath();
  }

}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x
  mouse.y = e.y
});

const ball = new Ball(context.canvas.width / 2, context.canvas.height / 2, 30, 2, 'red');
const init = () => {
  console.log(ball);
}

window.addEventListener('resize', (e) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * .8;
  init();
})

const animate = () => {
  requestAnimationFrame(animate);
  context.clearRect(0,0,context.canvas.width, context.canvas.height);
  ball.update();
  ball.draw(context);

}

animate();
init();