class Sprite {
  constructor(canvas) {
    this.spriteSheet = new Image();
    this.spriteSheet.src = 'sprite.png'

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.handleResize();

    this.width  = 64;
    this.height = 64;
    this.speed = 10;

    this.movementSpeed = 3;

    this.column = 0;
    this.row = 2;

    this.x = 0;
    this.y = 0;

    this.dir = 'none';

    this.pressedKeys = {};
    this.handleResize();

    this.spriteSheet.onload = () => {
      this.render();
    }

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.canvas.width = canvas.offsetWidth;
    this.canvas.height = canvas.offsetHeight;
    this.context.width = canvas.offsetWidth;
    this.context.height = canvas.offsetHeight;
  }

  handleKeyDown = (e) => {
    this.pressedKeys[`${e.which}`] = true;
  }
  handleKeyUp = (e) => {
    this.pressedKeys[`${e.which}`] = false;
  }

  animationIndex = 0
  lastDirection = 'none';

  animateDirection = () => {
    if (this.lastDirection !== this.dir) {
      this.animationIndex = 0;
    }

    this.animationIndex++;

    let index = Math.floor((this.animationIndex / 9) % 9)

    if (!Object.values(this.pressedKeys).reduce((r,v) => r||v, false)) {
      this.column = 0;
      return;
    }

    this.column = index;

    this.lastDirection = this.dir;
  }

  doKeyStuff = () => {
    for (const key in this.pressedKeys) {
      if (!this.pressedKeys[key]) continue;
      switch (key) {
        case '37':
          this.dir = 'left';
          this.row = 1;
          this.column = 0;
          this.x-=this.movementSpeed;
          break;
        case '39':
          this.dir = 'right';
          this.row = 3;
          this.column = 0;
          this.x+=this.movementSpeed;
          break;
        case '38':
          this.dir = 'up';
          this.row = 0;
          this.column = 0;

          this.y-=this.movementSpeed;
          break;
        case '40':
          this.dir = 'down';
          this.row = 2;
          this.column = 0;

          this.y+=this.movementSpeed;
          break;
        default:
          this.dir = 'none';
      }
    }
  }

  update = () => {
    this.doKeyStuff();
    this.animateDirection();

    this.x = Math.max(-20, Math.min(this.x, this.canvas.width - 44))
    this.y = Math.max(-14, Math.min(this.y, this.canvas.height - 50))
  }

  render = (time) => {
    const delta = time - this._last_render;

               //timeSinceLastFrame / frameRate
    const draws = (Math.floor(delta / (1000/60))) * this.speed
    this._last_render = time;

    for (let i = 0; i <= draws; i++) {
      this.update()
    }

    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    this.context.drawImage(this.spriteSheet, this.column*64, this.row*64, this.width, this.height, this.x, this.y, this.width, this.height)

    window.requestAnimationFrame(this.render);
  }

}


const canvas = document.getElementById('sprite');
new Sprite(canvas);
