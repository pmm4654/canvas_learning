canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .8;

class Circle {
  constructor(x, y, radius = 10, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color
    this.radius = this.radius;
  }

  update = (coordinates = {}) => {
    const { x, y } = coordinates;
    if(!x && !y) return;
    this.x = x;
    this.y = y;
  }

  draw = (ctx) => {
    ctx.globalAlpha = .5;
    ctx.beginPath(); // if you don't have this, it will connect the previous line to the circle
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'red';
    ctx.stroke()
    ctx.fill();
  }
}

const linePoints = {
  origin: new Circle(100, 400, 10, 'grey'), // line start
  cp1: new Circle(100, 100, 10, 'grey'), //control point 1
  destination: new Circle(500, 100, 10, 'grey'), // line end
  cp2: new Circle(500, 400, 10, 'grey'), // control point 2
}

const mouse = {
  x: undefined,
  y: undefined,
  down: false,
  draggingCircle: undefined
};

const distance = (originCoordinates, destinationCoordinate) => {
  const xDist = originCoordinates.x - destinationCoordinate.x;
  const yDist = originCoordinates.y - destinationCoordinate.y;
  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

const dragStart = (e) => {
  for(const key in linePoints) {
    if(distance(e, linePoints[key]) < linePoints[key].radius) {
      if(touchingCircle(e, linePoints[key])) return;
    }
  }
}

const touchingCircle = (e, circle) => {
  if(distance(e, circle) < circle.radius) {
    console.log('you are touching the circle')
    mouse.down = true;
    mouse.draggingCircle = circle;
  }
  return true;
}

canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.x
  mouse.y = e.y
  if(mouse.draggingCircle) {
    mouse.draggingCircle.update(mouse)
    mouse.draggingCircle.draw(ctx)
  }
});
canvas.addEventListener('mousedown', dragStart);


const dragEnd = (e) => {
  mouse.draggingCircle = undefined;
}
canvas.addEventListener('mouseout', dragEnd);
canvas.addEventListener('mouseup', dragEnd);

const drawCurve = () => {
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(linePoints.origin.x, linePoints.origin.y);
  ctx.bezierCurveTo(linePoints.cp1.x, linePoints.cp1.y, linePoints.cp2.x, linePoints.cp2.y, linePoints.destination.x, linePoints.destination.y);
  ctx.stroke();
};

const connectControlPointsToLine = (originCoordinates, destinationCoordinates) => {
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(originCoordinates.x, originCoordinates.y);
  ctx.lineTo(destinationCoordinates.x, destinationCoordinates.y);
  ctx.strokeStyle = '#000';
  ctx.stroke();
}

const process = () => {
  ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
  for(const key in linePoints) {
    linePoints[key].update();
    linePoints[key].draw(ctx);
  }
  drawCurve();
  connectControlPointsToLine(linePoints.cp1, linePoints.origin);
  connectControlPointsToLine(linePoints.cp2, linePoints.destination);
}

const gameLoop = () => {
  let lastRender = null;
  const animate = (timestamp) => {
    const delta = lastRender ? timestamp - lastRender : 32;
    const renders = Math.floor(delta /  (1000/60)); // ms passed / frames per second
    ctx.fillStyle = '#000';
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