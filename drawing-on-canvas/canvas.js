const canvas = document.getElementById('createAndResize');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .8;

const context = canvas.getContext('2d');


context.fillStyle = 'rgba(255, 0, 0, 0.1)';
context.fillRect(20,20,20,20)
context.fillRect(60,20,20,20)

context.fillStyle = 'rgba(255, 0, 0, 0.4)';
context.fillRect(20,50,20,20)
context.fillRect(40,60,20,20)
context.fillRect(40,60,20,20)
context.fillRect(60,50,20,20)

// Line

context.beginPath();
context.moveTo(50, 300); // starting point
context.lineTo(300, 100); // mov point
context.lineTo(400, 300); // ending point
context.strokeStyle = 'limegreen';
context.stroke()

// Arc/Circle

// arc(x, y, radius, startAngle, endAngle, [anticlockwise]) // angles in radians

// Radians:

for(let i = 0; i < 3; i++) {
  const radius = Math.floor(Math.random() * 80);
  const x = Math.floor(Math.random() * context.canvas.width);
  const y = Math.floor(Math.random() * context.canvas.height);
  context.beginPath(); // if you don't have this, it will connect the previous line to the circle
  context.arc(x, y, radius, Math.PI * 2, false);
  context.strokeStyle = 'blue';
  context.stroke()

}

