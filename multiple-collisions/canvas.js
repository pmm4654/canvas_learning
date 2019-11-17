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
  gravity: .1,
  friction: 0.8,
  MAX_PARTICLES: 4,
}


class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  update = () => {

  }

  draw = (context) => {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // context.fillStyle = this.color;
    // context.fill()
    context.strokeStyle = this.color;
    context.stroke();
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

const distance = (x1, y1, x2, y2) => {
  const xDist = x2 - x1;
  const yDist = y2 - y1;
  Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

const random = ( min, max ) => {
	return Math.random() * ( max - min ) + min;
}

const randomColor = (colorPalette = tropicalFishPalette) => (
  colorPalette[Math.floor(Math.random() * colorPalette.length)]
);

const newParticle = () => {
  radius = 100;
  return new Particle(
    random(radius, context.canvas.width - radius),
    random(radius, context.canvas.height - radius),
    radius, // Math.random() * 40,
    randomColor()
  );
}

const particle = new Particle(context.canvas.width / 2, context.canvas.height / 2, 30, 2, 'red');
let particles = [];

const init = () => {
  particles = [];
  for(let i = 0; i < config.MAX_PARTICLES; i++) {
    let daParticle = newParticle();

    if(i !== 0) {
      for(let j = 0; j < particles.length; j++) {
        const distanceBetweenCircles = distance(daParticle.x, daParticle.y, particles[j].x, particles[j].y)
        const radiusOfBothCircles = daParticle.radius + particles[j].radius;
        if(distanceBetweenCircles - (radiusOfBothCircles)  < 0) {
          daParticle = newParticle();
          j = -1;
        }
      }
    }

    if(daParticle.y > context.canvas.height - daParticle.radius) debugger;
    particles.push(daParticle)
  }
}

window.addEventListener('resize', (e) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * .8;
  init();
})

const process = () => {
  context.clearRect(0,0,context.canvas.width, context.canvas.height);
  for(let i = 0; i < particles.length; i++) {
    particles[i].update(context);
    particles[i].draw(context);
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