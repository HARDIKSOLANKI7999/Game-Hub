import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quick-math',
  imports: [CommonModule, FormsModule],
  templateUrl: './quick-math.html',
  styleUrl: './quick-math.css',
})
export class QuickMath implements OnDestroy {
  a = 0;
  b = 0;
  op = '+';
  answer = '';
  score = 0;
  level = 1;
  seconds = 30;
  running = false;
  interval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.restart();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  restart() {
    this.stopTimer();
    this.score = 0;
    this.level = 1;
    this.seconds = 30;
    this.running = true;
    this.next();
    this.interval = setInterval(() => {
      this.seconds--;
      if (this.seconds <= 0) this.stopTimer();
    }, 1000);
  }

  next() {
    const max = 10 + this.level * 5;
    const ops = this.level > 3 ? ['+', '-', '*'] : ['+', '-'];
    this.op = ops[Math.floor(Math.random() * ops.length)];
    this.a = this.rand(max);
    this.b = this.rand(max);
    if (this.op === '-' && this.b > this.a) [this.a, this.b] = [this.b, this.a];
    this.answer = '';
  }

  submit() {
    if (!this.running || Number(this.answer) !== this.correct) return;
    this.score++;
    this.level = Math.floor(this.score / 5) + 1;
    this.next();
  }

  get correct(): number {
    if (this.op === '-') return this.a - this.b;
    if (this.op === '*') return this.a * this.b;
    return this.a + this.b;
  }

  rand(max: number): number {
    return Math.floor(Math.random() * max) + 1;
  }

  stopTimer() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
    this.running = false;
  }
}
