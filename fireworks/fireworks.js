


const setupCanvasContext = () => {
  const canvas = document.getElementById( 'canvas' )
  const ctx = canvas.getContext( '2d' )
  // full screen dimensions
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  return ctx
}

// get a random number within a range
const random = ( min, max ) => {
	return Math.random() * ( max - min ) + min;
}

const config = {
  VELOCITY: 4,
  PARTICLE_SIZE: 4,
  context: setupCanvasContext(),
  MAX_EXPLOSION_PARTICLES: 40,
  // firework collection
  fireworks: [],
  // particle collection
  pixels: [],
  mousedown: false,
  mouse: {
    x: undefined,
    y: undefined
  },
  limiterCount: 0,
  limiterTotal: 5
}

class Firework {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.angle = Math.atan2( targetY - y, targetX - x );
    this.color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
    this.acceleration = 1.05;
    this.yVelocity = config.VELOCITY;

    const howManyXforEachY = (this.targetX - this.x) / (this.targetY - this.y); // maybe slope - don't remember?
    // how many x's are in a y?
    const xVelocity = this.yVelocity  * howManyXforEachY;   
    this.xVelocity = this.angle ? xVelocity: 0;
  }

  calculateVelocity = () => {
    if(isNaN(this.angle)) {
      return {x: 0, y: this.yVelocity *= this.acceleration} 
    } 
    return { 
      // wrong, but fun, way to make the firework go to your mouse coordinates
      // x: this.xVelocity = this.xVelocity * this.acceleration + Math.cos(this.angle), 
      // y: this.yVelocity = this.yVelocity * this.acceleration + Math.abs(Math.sin(this.angle)), 
      x: this.xVelocity *= this.acceleration,
      y: this.yVelocity *= this.acceleration
    } 
  };

  update = (index, ctx) => {
    const {x:xVelocity, y:yVelocity} = this.calculateVelocity()
    this.y -= yVelocity; // move up!
    this.x -= xVelocity; // move over!
    
    if( 
      this.y < random(ctx.canvas.height * .3, ctx.canvas.height * .2) // too hight
      || (this.angle && this.x < random(ctx.canvas.width * .2, ctx.canvas.width * .1)) //
      || (this.angle && this.x > random(ctx.canvas.width * .8, ctx.canvas.width * .9))
      ) 
    {
      config.fireworks.splice(index, 1);
      for(let i = 0; i < config.MAX_EXPLOSION_PARTICLES; i++) {
        config.pixels.push(new Pixel(this.x, this.y, this.color, true))
      }
      return true;
    }

    return false;
  }

  draw = (ctx) => {
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, config.PARTICLE_SIZE, config.PARTICLE_SIZE)
    config.pixels.push(new Pixel(this.x, this.y, this.color))
  }
}

class Pixel {
  constructor(x, y, color, exploding = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.opacity = 1;
    this.exploding = exploding;
    this.gravity = 1;
    // for exploding particles
    this.angle = random(0, Math.PI * 2); // random angle in a circle
    this.speed = random( 1, 10 ) + config.VELOCITY;
  }

  update = (index) => {
    this.opacity -= .02;
    if(this.exploding) this.explode();
    if(this.opacity < 0) {
      config.pixels.splice(index, 1);
      return true;
    }
  }

  explode = () => {
    this.x += Math.cos( this.angle ) * this.speed;
    this.y += Math.sin( this.angle ) * this.speed + this.gravity;    
  }

  draw = (ctx) => {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, config.PARTICLE_SIZE,config.PARTICLE_SIZE);
  }
}


const addFirework = (x, y, targetX, targetY) => {
  if(typeof x === 'undefined') x = config.context.canvas.width / 2;
  config.fireworks.push(new Firework(x, config.context.canvas.height, targetX, targetY))
}

const processFireworks = () => {
  for(let i = 0; i < config.fireworks.length; i++) {
    const done = config.fireworks[i].update(i, config.context);
    if(!done) config.fireworks[i].draw(config.context);
  }

  for(let i = 0; i < config.pixels.length; i++) {
    const done = config.pixels[i].update(i);
    if(!done) config.pixels[i].draw(config.context);
  }  
}

const gameLoop = () => {
  addFirework()
  let lastRender = null;
  const animate = (timestamp) => {
    const delta = lastRender ? timestamp - lastRender : 60;
    const renders = Math.floor(delta /  30); // ms passed / frames per second 
    if(renders > 0) {
      config.context.fillStyle = '#000';
      config.context.clearRect(0,0,config.context.canvas.width, config.context.canvas.width)
      for(let i = 0; i < renders; i++) {
        processFireworks()
        lastRender = timestamp;
        if( config.limiterCount >= config.limiterTotal ) {
          if( config.mousedown ) {
            addFirework(config.context.canvas.width / 2, config.context.canvas.height, config.mouse.x, config.mouse.y);
            config.limiterCount = 0;
          }
        } else {
          config.limiterCount++
        }
      }
    }

    window.requestAnimationFrame(animate);
  }
  window.requestAnimationFrame(animate)
}


config.context.canvas.addEventListener( 'mousedown', function(e) {
	e.preventDefault();
	config.mousedown = true;
});

config.context.canvas.addEventListener( 'mouseup', function(e) {
	e.preventDefault();
	config.mousedown = false;
});

config.context.canvas.addEventListener( 'mousemove', function(e) {
	config.mouse.x = e.pageX - config.context.canvas.offsetLeft;
	config.mouse.y = e.pageY - config.context.canvas.offsetTop;
});

window.onload = gameLoop()