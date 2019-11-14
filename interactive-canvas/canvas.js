const canvas = document.getElementById('createAndResize');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .8;

const context = canvas.getContext('2d');
context.globalCompositeOperation  = 'saturation';
const NUM_CIRCLES = 700;

const mouse = {
  x: undefined,
  y: undefined
};

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x
  mouse.y = e.y
});

const colorArray = [
  '#ffaa33',
  '#99ffaa',
  '#00ff00',
  '#4411aa',
  '#ff1100'
];


tropicalFishPalette = [
  '#0D0D0D',
  '#A68B03',
  '#4227F2',
  '#2405F2',
  '#6503A6',
];

const jellyFishPalette = [
  '#1D16F2',
  '#040DBF',
  '#03178C',
  '#010626',
  '#021859',
];

const zebraFishPalette = [
  '#5005F2',
  '#1D04BF',
  '#15038C',
  '#050259',
  '#010440',
];


class Circle {
  constructor(x, y, colorPalette = colorArray) {
    this.x = x;
    this.y = y;
    this.color = colorPalette[Math.floor(Math.random() * colorArray.length)]
    this.radius = Math.random() * 20 + 1;
    this.initialRadius = this.radius;
    this.maxRadius = this.radius * 7;
    this.xVelocity = Math.floor((Math.random() - 0.5) * 3);
    this.yVelocity = Math.floor((Math.random() - 0.5) * 3);
    this.distanceFromMouse = 100;
  }

  isCloseToMouse = (axis = 'x') => (
    mouse[axis] - this[axis] < this.distanceFromMouse && mouse[axis] - this[axis] > -this.distanceFromMouse
  )

  draw = (context) => {
    if(this.isCloseToMouse('x') && this.isCloseToMouse('y')) {
      this.radius = Math.min(this.radius + 2, this.maxRadius);
    } else {
      this.radius = Math.max(this.radius - 2, this.initialRadius);
    }
    context.beginPath(); // if you don't have this, it will connect the previous line to the circle
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    context.fill();
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

const newCircle = (colorPalette) => new Circle(
  Math.floor(Math.random() * context.canvas.width),
  Math.floor(Math.random() * context.canvas.height),
  colorPalette
);
let circles = []

const init = () => {
  circles = [];
  circles = new Array(NUM_CIRCLES).fill(0).map((circle, i) => newCircle(zebraFishPalette))
  for(const circle of circles) {
    circle.update(context)
    circle.draw(context)
  }
}

window.addEventListener('resize', (e) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * .8;
  init();
})

const process = () => {
  context.clearRect(0,0,context.canvas.width, context.canvas.height);
  for(const circle of circles) {
    circle.update(context)
    circle.draw(context)
  }
}

const gameLoop = () => {
  init();
  let lastRender = null;
  const animate = (timestamp) => {
    const delta = lastRender ? timestamp - lastRender : 32;
    const renders = Math.floor(delta /  (1000/60)); // ms passed / frames per second
    context.fillStyle = '#000';
    if(renders > 0) {
      for(let i = 0; i < renders; i++) {
        process()
        lastRender = timestamp;
      }
    }

    window.requestAnimationFrame(animate);
  }
  window.requestAnimationFrame(animate)
}

gameLoop();
// init();