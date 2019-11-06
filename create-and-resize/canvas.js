const canvas = document.getElementById('createAndResize');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .8;

const context = canvas.getContext('2d');

context.fillStyle = 'black';
context.fillRect(20,20,20,20)
context.fillRect(60,20,20,20)

context.fillRect(20,50,20,20)
context.fillRect(40,60,20,20)
context.fillRect(40,60,20,20)
context.fillRect(60,50,20,20)