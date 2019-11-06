const canvas = document.getElementById('createAndResize');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .8;

const context = canvas.getContext('2d');

const NUM_CIRCLES = 40;

class Circle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 50;
    this.xVelocity = Math.floor((Math.random() - 0.5) * 18);
    this.yVelocity = Math.floor((Math.random() - 0.5) * 18);
  }

  draw = (context) => {
    context.beginPath(); // if you don't have this, it will connect the previous line to the circle
    context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    context.strokeStyle = 'blue';
    context.stroke()
  }

  update = (context) => {      
    if(this.x > context.canvas.width - this.radius) {
      this.x = context.canvas.width - this.radius;
      this.xVelocity = -this.xVelocity;
    } else if (this.x - this.radius < 0) {
      this.x = this.radius
      this.xVelocity = -this.xVelocity;
    }
    if(this.y > context.canvas.height - this.radius) {
      this.y = context.canvas.height - this.radius;
      this.yVelocity = -this.yVelocity;
    } else if(this.y - this.radius < 0) {
      this.y = this.radius;
      this.yVelocity = -this.yVelocity;
    }      
    this.x += this.xVelocity;
    this.y += this.yVelocity;
  }
}

const newCircle = () => new Circle(Math.floor(Math.random() * context.canvas.width), Math.floor(Math.random() * context.canvas.height));
const circles = new Array(NUM_CIRCLES).fill(0).map((circle, i) => newCircle())

const animate = () => {
  requestAnimationFrame(animate);
  context.clearRect(0,0,context.canvas.width, context.canvas.height);
  for(const circle of circles) {
    circle.update(context)
    circle.draw(context)
  }
}

animate();