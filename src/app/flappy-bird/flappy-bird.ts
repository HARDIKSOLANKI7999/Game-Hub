import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'app-flappy-bird',
  imports: [CommonModule],
  templateUrl: './flappy-bird.html',
  styleUrl: './flappy-bird.css',
})
export class FlappyBird {

  constructor(private cdr: ChangeDetectorRef) {}

  @ViewChild('gameCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;

  bird = {
    x: 90,
    y: 300,
    size: 22,
    velocity: 0
  };

  gravity = 0.45;
  jump = -8.5;

  pipes: any[] = [];

  score = 0;
  bestScore = 0;

  gameOver = false;

  loop: any;

  ngAfterViewInit() {

    this.ctx =
      this.canvasRef.nativeElement.getContext('2d')!;

    this.bestScore =
      Number(localStorage.getItem('flappyBest')) || 0;

    this.startGame();
  }

  startGame() {

    this.bird.y = 300;
    this.bird.velocity = 0;

    this.pipes = [];

    this.score = 0;

    this.gameOver = false;

    this.createPipe();

    clearInterval(this.loop);

    this.loop = setInterval(() => {

      this.update();

      this.draw();

    }, 16);

    this.cdr.detectChanges();
  }

  createPipe() {

    const gap = 170;

    const top =
      Math.random() * 250 + 50;

    this.pipes.push({
      x: 420,
      width: 70,
      top,
      bottom: top + gap,
      passed: false
    });
  }

  update() {

    if (this.gameOver) return;

    // gravity
    this.bird.velocity += this.gravity;
    this.bird.y += this.bird.velocity;

    // top / bottom collision
    if (
      this.bird.y < 0 ||
      this.bird.y > 650
    ) {
      this.endGame();
    }

    // pipes
    this.pipes.forEach(pipe => {

      pipe.x -= 2.8;

      // score
      if (
        !pipe.passed &&
        pipe.x < this.bird.x
      ) {
        pipe.passed = true;
        this.score++;
        this.cdr.detectChanges();
      }

      // collision
      if (
        this.bird.x + this.bird.size > pipe.x &&
        this.bird.x - this.bird.size < pipe.x + pipe.width &&
        (
          this.bird.y - this.bird.size < pipe.top ||
          this.bird.y + this.bird.size > pipe.bottom
        )
      ) {
        this.endGame();
      }
    });

    // remove old
    this.pipes =
      this.pipes.filter(
        p => p.x + p.width > 0
      );

    // new pipes
    if (
      this.pipes.length === 0 ||
      this.pipes[this.pipes.length - 1].x < 240
    ) {
      this.createPipe();
    }
  }

  draw() {

    const ctx = this.ctx;

    // clear
    ctx.clearRect(0, 0, 420, 650);

    // clouds
    ctx.fillStyle = 'rgba(255,255,255,0.5)';

    ctx.beginPath();
    ctx.arc(80, 100, 30, 0, Math.PI * 2);
    ctx.arc(110, 100, 25, 0, Math.PI * 2);
    ctx.fill();

    // bird
    ctx.fillStyle = '#facc15';

    ctx.beginPath();

    ctx.arc(
      this.bird.x,
      this.bird.y,
      this.bird.size,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // eye
    ctx.fillStyle = 'black';

    ctx.beginPath();

    ctx.arc(
      this.bird.x + 8,
      this.bird.y - 5,
      3,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // pipes
    this.pipes.forEach(pipe => {

      const gradient =
        ctx.createLinearGradient(
          pipe.x,
          0,
          pipe.x + pipe.width,
          0
        );

      gradient.addColorStop(0, '#22c55e');
      gradient.addColorStop(1, '#15803d');

      ctx.fillStyle = gradient;

      // top
      ctx.fillRect(
        pipe.x,
        0,
        pipe.width,
        pipe.top
      );

      // bottom
      ctx.fillRect(
        pipe.x,
        pipe.bottom,
        pipe.width,
        650 - pipe.bottom
      );
    });
  }

  endGame() {

    this.gameOver = true;

    clearInterval(this.loop);

    if (this.score > this.bestScore) {

      this.bestScore = this.score;

      localStorage.setItem(
        'flappyBest',
        this.bestScore.toString()
      );
    }

    this.cdr.detectChanges();
  }

  @HostListener('window:keydown.space')
  fly() {

    if (!this.gameOver) {

      this.bird.velocity = this.jump;
    }
  }

  ngOnDestroy() {
    clearInterval(this.loop);
  }
}
