import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-brick-breaker',
  imports: [CommonModule],
  templateUrl: './brick-breaker.html',
  styleUrl: './brick-breaker.css',
})
export class BrickBreaker implements AfterViewInit {
   
  @ViewChild('gameCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;

  // GAME
  score = 0;

  lives = 3;

  gameOver = false;

  won = false;

  // BALL
  ballX = 450;
  ballY = 400;

  ballRadius = 10;

  dx = 4;
  dy = -4;

  // PADDLE
  paddleWidth = 130;
  paddleHeight = 16;

  paddleX = 380;

  // BRICKS
  rows = 5;
  cols = 10;

  brickWidth = 75;
  brickHeight = 24;

  brickPadding = 10;

  brickOffsetTop = 60;
  brickOffsetLeft = 35;

  bricks: any[] = [];

  animation: any;

  ngAfterViewInit() {

    const canvas =
      this.canvasRef.nativeElement;

    this.ctx =
      canvas.getContext('2d')!;

    this.startGame();
  }

  startGame() {

    cancelAnimationFrame(this.animation);

    this.score = 0;

    this.lives = 3;

    this.gameOver = false;

    this.won = false;

    this.ballX = 450;
    this.ballY = 400;

    this.dx = 4;
    this.dy = -4;

    this.paddleX = 380;

    this.createBricks();

    this.loop();
  }

  createBricks() {

    this.bricks = [];

    for (let r = 0; r < this.rows; r++) {

      for (let c = 0; c < this.cols; c++) {

        this.bricks.push({

          x:
            c *
            (this.brickWidth + this.brickPadding)
            + this.brickOffsetLeft,

          y:
            r *
            (this.brickHeight + this.brickPadding)
            + this.brickOffsetTop,

          visible: true,

          color:
            this.randomColor()
        });
      }
    }
  }

  loop() {

    this.draw();

    this.update();

    if (!this.gameOver) {

      this.animation =
        requestAnimationFrame(
          () => this.loop()
        );
    }
  }

  draw() {

    const canvas =
      this.canvasRef.nativeElement;

    // CLEAR
    this.ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // BACKGROUND GLOW
    this.ctx.fillStyle =
      '#020617';

    this.ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // BRICKS
    this.bricks.forEach(brick => {

      if (!brick.visible) return;

      this.ctx.fillStyle =
        brick.color;

      this.ctx.shadowBlur = 15;

      this.ctx.shadowColor =
        brick.color;

      this.ctx.fillRect(
        brick.x,
        brick.y,
        this.brickWidth,
        this.brickHeight
      );
    });

    // BALL
    this.ctx.beginPath();

    this.ctx.arc(
      this.ballX,
      this.ballY,
      this.ballRadius,
      0,
      Math.PI * 2
    );

    this.ctx.fillStyle = '#22d3ee';

    this.ctx.shadowBlur = 20;

    this.ctx.shadowColor = '#22d3ee';

    this.ctx.fill();

    this.ctx.closePath();

    // PADDLE
    this.ctx.fillStyle = '#22c55e';

    this.ctx.shadowBlur = 20;

    this.ctx.shadowColor = '#22c55e';

    this.ctx.fillRect(
      this.paddleX,
      510,
      this.paddleWidth,
      this.paddleHeight
    );
  }

  update() {

    const canvas =
      this.canvasRef.nativeElement;

    this.ballX += this.dx;

    this.ballY += this.dy;

    // WALL COLLISION
    if (
      this.ballX + this.ballRadius >
      canvas.width ||

      this.ballX - this.ballRadius < 0
    ) {

      this.dx *= -1;
    }

    if (
      this.ballY - this.ballRadius < 0
    ) {

      this.dy *= -1;
    }

    // PADDLE
    if (

      this.ballY + this.ballRadius > 510 &&

      this.ballX > this.paddleX &&

      this.ballX <
      this.paddleX + this.paddleWidth

    ) {

      this.dy *= -1;
    }

    // FLOOR
    if (
      this.ballY > canvas.height
    ) {

      this.lives--;

      if (this.lives <= 0) {

        this.gameOver = true;

        this.won = false;

        return;
      }

      this.ballX = 450;
      this.ballY = 400;
    }

    // BRICKS
    this.bricks.forEach(brick => {

      if (!brick.visible) return;

      if (

        this.ballX >
        brick.x &&

        this.ballX <
        brick.x + this.brickWidth &&

        this.ballY >
        brick.y &&

        this.ballY <
        brick.y + this.brickHeight

      ) {

        brick.visible = false;

        this.dy *= -1;

        this.score += 10;
      }
    });

    // WIN
    if (

      this.bricks.every(
        b => !b.visible
      )

    ) {

      this.gameOver = true;

      this.won = true;
    }
  }

  movePaddle(event: MouseEvent) {

    const rect =
      this.canvasRef.nativeElement
      .getBoundingClientRect();
    const scaleX =
      this.canvasRef.nativeElement.width / rect.width;

    this.paddleX =
      (event.clientX - rect.left) * scaleX -
      this.paddleWidth / 2;

    this.paddleX = Math.max(
      0,
      Math.min(
        this.canvasRef.nativeElement.width - this.paddleWidth,
        this.paddleX
      )
    );
  }

  randomColor(): string {

    const colors = [

      '#22d3ee',
      '#8b5cf6',
      '#ec4899',
      '#f59e0b',
      '#22c55e',
      '#ef4444'
    ];

    return colors[
      Math.floor(
        Math.random() *
        colors.length
      )
    ];
  }
}
