const canvas = document.getElementById('createAndResize');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .8;

const context = canvas.getContext('2d');
// context.globalCompositeOperation  = 'soft-light';
const NUM_CIRCLES = 700;

const mouse = {
  x: 10,
  y: 10
};

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});


const config = {
  gravity: 1,
  friction: 0.8,
}

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

window.addEventListener('resize', (e) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * .8;
  init();
});

class Circle {
  constructor({x, y, radius, color}) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  update = (mouse) => {
    if(mouse) {
      const {x, y} = mouse;
      if(x) this.x = x;
      if(y) this.y = y;
    }
    this.draw(context);
  }

  draw = (c) => {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
}

let circle1;
let circle2;

const init = () => {
  circle1 = new Circle({x: 300, y: 300, radius: 100, color: 'black'});
  circle2 = new Circle({x: 600, y: 300, radius: 30, color: 'red'});
}

const process = () => {
  context.fillStyle = '#000';
  context.clearRect(0,0,context.canvas.width, context.canvas.width)
  circle1.update();
  circle1.draw(context);
  circle2.update(mouse);
  circle2.draw(context);
  if(getDistance(circle1.x, circle1.y, circle2.x, circle2.y) < circle1.radius + circle2.radius) {
    circle1.color = 'red';
    circle1.update();
    circle1.draw(context)
  } else {
    circle1.color = 'black';
  }
}

const getDistance = (x1, y1, x2, y2) => {
  const xDistance = x2 - x1; 
  const yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2)  + Math.pow(yDistance, 2))
}

const gameLoop = () => {
  init();
  let lastRender = null;
  const animate = (timestamp) => {
    const delta = lastRender ? timestamp - lastRender : 32;
    const renders = Math.floor(delta /  (1000/60)); // ms passed / frames per second 
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