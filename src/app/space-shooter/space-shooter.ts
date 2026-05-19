import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';

type Body = { x: number; y: number; w: number; h: number; speed: number };

@Component({
  selector: 'app-space-shooter',
  imports: [CommonModule],
  templateUrl: './space-shooter.html',
  styleUrl: './space-shooter.css',
})
export class SpaceShooter implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  player: Body = { x: 190, y: 520, w: 34, h: 34, speed: 5 };
  bullets: Body[] = [];
  enemies: Body[] = [];
  keys = new Set<string>();
  score = 0;
  gameOver = false;
  frame = 0;
  raf = 0;
  ctx!: CanvasRenderingContext2D;

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.loop();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.raf);
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event.code === 'Space') event.preventDefault();
    if (event.code === 'Space') this.shoot();
    this.keys.add(event.code);
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    this.keys.delete(event.code);
  }

  loop = () => {
    if (!this.gameOver) this.update();
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  update() {
    const c = this.canvas.nativeElement;
    if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) this.player.x -= this.player.speed;
    if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) this.player.x += this.player.speed;
    if (this.keys.has('ArrowUp') || this.keys.has('KeyW')) this.player.y -= this.player.speed;
    if (this.keys.has('ArrowDown') || this.keys.has('KeyS')) this.player.y += this.player.speed;
    this.player.x = Math.max(0, Math.min(c.width - this.player.w, this.player.x));
    this.player.y = Math.max(0, Math.min(c.height - this.player.h, this.player.y));

    if (++this.frame % 55 === 0) this.enemies.push({ x: Math.random() * (c.width - 28), y: -32, w: 28, h: 28, speed: 2 + this.score / 20 });
    this.bullets.forEach(b => b.y -= b.speed);
    this.enemies.forEach(e => e.y += e.speed);

    this.enemies = this.enemies.filter(enemy => {
      if (this.hit(enemy, this.player) || enemy.y > c.height) {
        this.gameOver = true;
        return false;
      }

      const bullet = this.bullets.find(b => this.hit(b, enemy));
      if (bullet) {
        this.bullets = this.bullets.filter(b => b !== bullet);
        this.score++;
        return false;
      }

      return true;
    });

    this.bullets = this.bullets.filter(b => b.y + b.h > 0);
  }

  shoot() {
    if (this.gameOver || this.frame % 8 === 0) return;
    this.bullets.push({ x: this.player.x + this.player.w / 2 - 3, y: this.player.y - 12, w: 6, h: 14, speed: 8 });
  }

  hit(a: Body, b: Body): boolean {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  restart() {
    this.player = { x: 190, y: 520, w: 34, h: 34, speed: 5 };
    this.bullets = [];
    this.enemies = [];
    this.keys.clear();
    this.score = 0;
    this.frame = 0;
    this.gameOver = false;
  }

  draw() {
    const c = this.canvas.nativeElement;
    this.ctx.clearRect(0, 0, c.width, c.height);
    this.ctx.fillStyle = '#07111f';
    this.ctx.fillRect(0, 0, c.width, c.height);
    this.ctx.fillStyle = '#22d3ee';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h);
    this.ctx.fillStyle = '#fbbf24';
    this.bullets.forEach(b => this.ctx.fillRect(b.x, b.y, b.w, b.h));
    this.ctx.fillStyle = '#fb7185';
    this.enemies.forEach(e => this.ctx.fillRect(e.x, e.y, e.w, e.h));
    if (this.gameOver) {
      this.ctx.fillStyle = '#f8fafc';
      this.ctx.font = '32px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Game Over', c.width / 2, c.height / 2);
    }
  }
}
