import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-snake',
  imports: [CommonModule, RouterModule],
  templateUrl: './snake.html',
  styleUrl: './snake.css',
})

export class Snake implements OnDestroy {

  constructor(private cdr: ChangeDetectorRef) { }

  @ViewChild('gameCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;

  gridSize = 35;
  tileCount = 20;

  snake: any[] = [];

  direction = {
    x: 1,
    y: 0
  };

  food = {
    x: 10,
    y: 10
  };

  score = 0;
  bestScore = 0;

  speed = 120;

  gameLoop: any;

  gameOver = false;

  touchStartX = 0;
  touchStartY = 0;

  ngAfterViewInit() {

    this.ctx =
      this.canvasRef.nativeElement.getContext('2d')!;

    this.bestScore =
      Number(localStorage.getItem('snakeBest')) || 0;

    setTimeout(() => {
      this.startGame();
    });
    this.cdr.detectChanges();
  }

  startGame() {

    this.snake = [
      { x: 5, y: 10 }
    ];

    this.direction = {
      x: 1,
      y: 0
    };

    this.food = {
      x: 15,
      y: 10
    };

    this.score = 0;

    this.gameOver = false;

    clearInterval(this.gameLoop);

    this.gameLoop = setInterval(() => {

      this.update();

      this.draw();

    }, this.speed);
  }

  update() {

    if (this.gameOver) return;

    const head = {
      x: this.snake[0].x + this.direction.x,
      y: this.snake[0].y + this.direction.y
    };

    // WALL COLLISION
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= this.tileCount ||
      head.y >= this.tileCount
    ) {
      this.endGame();
      return;
    }

    // SELF COLLISION
    for (let part of this.snake) {

      if (
        part.x === head.x &&
        part.y === head.y
      ) {
        this.endGame();
        return;
      }
    }

    this.snake.unshift(head);

    // FOOD
    if (
      head.x === this.food.x &&
      head.y === this.food.y
    ) {

      this.score++;
      this.cdr.detectChanges();

      this.placeFood();

      // SPEED UP
      if (this.speed > 60) {

        this.speed -= 2;

        clearInterval(this.gameLoop);

        this.gameLoop = setInterval(() => {

          this.update();

          this.draw();

        }, this.speed);
      }

    } else {

      this.snake.pop();
    }
  }

  placeFood() {
    const emptyCells = [];

    for (let y = 0; y < this.tileCount; y++) {
      for (let x = 0; x < this.tileCount; x++) {
        if (!this.snake.some(part => part.x === x && part.y === y)) {
          emptyCells.push({ x, y });
        }
      }
    }

    this.food = emptyCells[Math.floor(Math.random() * emptyCells.length)] ?? this.food;
  }

  draw() {

    const ctx = this.ctx;

    // CLEAR
    ctx.clearRect(0, 0, 700, 700);

    // GRID
    for (let y = 0; y < this.tileCount; y++) {

      for (let x = 0; x < this.tileCount; x++) {

        ctx.fillStyle =
          (x + y) % 2 === 0
            ? '#a3e635'
            : '#84cc16';

        ctx.fillRect(
          x * this.gridSize,
          y * this.gridSize,
          this.gridSize,
          this.gridSize
        );
      }
    }

    // FOOD
    ctx.beginPath();

    ctx.fillStyle = '#ef4444';

    ctx.arc(
      this.food.x * this.gridSize + 17,
      this.food.y * this.gridSize + 17,
      14,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // APPLE STEM
    ctx.fillStyle = '#166534';

    ctx.fillRect(
      this.food.x * this.gridSize + 15,
      this.food.y * this.gridSize + 2,
      4,
      10
    );

    // SNAKE
    this.snake.forEach((part, index) => {

      const x =
        part.x * this.gridSize;

      const y =
        part.y * this.gridSize;

      // BODY
      const gradient =
        ctx.createLinearGradient(
          x,
          y,
          x + this.gridSize,
          y + this.gridSize
        );

      gradient.addColorStop(0, '#60a5fa');
      gradient.addColorStop(1, '#2563eb');

      ctx.fillStyle = gradient;

      ctx.beginPath();

      ctx.roundRect(
        x + 2,
        y + 2,
        this.gridSize - 4,
        this.gridSize - 4,
        12
      );

      ctx.fill();

      // HEAD
      if (index === 0) {

        // EYES
        ctx.fillStyle = 'white';

        ctx.beginPath();

        ctx.arc(x + 10, y + 12, 4, 0, Math.PI * 2);
        ctx.arc(x + 24, y + 12, 4, 0, Math.PI * 2);

        ctx.fill();

        // PUPILS
        ctx.fillStyle = 'black';

        ctx.beginPath();

        ctx.arc(x + 10, y + 12, 2, 0, Math.PI * 2);
        ctx.arc(x + 24, y + 12, 2, 0, Math.PI * 2);

        ctx.fill();
      }
    });
  }

  endGame() {

    this.gameOver = true;

    clearInterval(this.gameLoop);

    if (this.score > this.bestScore) {

      this.bestScore = this.score;

      localStorage.setItem(
        'snakeBest',
        this.bestScore.toString()
      );
    }
  }

  // KEYBOARD
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key.startsWith('Arrow')) {
      event.preventDefault();
    }

    switch (event.key) {

      case 'ArrowUp':
        if (this.direction.y === 0) {
          this.direction = { x: 0, y: -1 };
        }
        break;

      case 'ArrowDown':
        if (this.direction.y === 0) {
          this.direction = { x: 0, y: 1 };
        }
        break;

      case 'ArrowLeft':
        if (this.direction.x === 0) {
          this.direction = { x: -1, y: 0 };
        }
        break;

      case 'ArrowRight':
        if (this.direction.x === 0) {
          this.direction = { x: 1, y: 0 };
        }
        break;
    }
  }

  // MOBILE TOUCH
  handleTouchStart(event: TouchEvent) {

    this.touchStartX =
      event.touches[0].clientX;

    this.touchStartY =
      event.touches[0].clientY;
  }

  handleTouchMove(event: TouchEvent) {
    event.preventDefault();

    const dx =
      event.touches[0].clientX - this.touchStartX;

    const dy =
      event.touches[0].clientY - this.touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {

      if (dx > 0 && this.direction.x === 0) {
        this.direction = { x: 1, y: 0 };
      }

      else if (dx < 0 && this.direction.x === 0) {
        this.direction = { x: -1, y: 0 };
      }

    } else {

      if (dy > 0 && this.direction.y === 0) {
        this.direction = { x: 0, y: 1 };
      }

      else if (dy < 0 && this.direction.y === 0) {
        this.direction = { x: 0, y: -1 };
      }
    }
  }

  ngOnDestroy() {
    clearInterval(this.gameLoop);
  }
}
