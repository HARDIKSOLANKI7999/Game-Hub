import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-typing-test',
  imports: [CommonModule, FormsModule],
  templateUrl: './typing-test.html',
  styleUrl: './typing-test.css',
})
export class TypingTest implements OnDestroy {
  paragraphs = [
    'Practice turns small efforts into quick confident progress.',
    'Bright ideas grow when curious minds keep asking better questions.',
    'Simple games can make focus feel lighter and more rewarding.',
  ];

  paragraph = '';
  text = '';
  seconds = 60;
  running = false;
  done = false;
  interval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.restart();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  onType() {
    if (!this.running && !this.done && this.text) this.startTimer();
    if (this.text === this.paragraph) this.finish();
  }

  startTimer() {
    this.running = true;
    this.interval = setInterval(() => {
      this.seconds--;
      if (this.seconds <= 0) this.finish();
    }, 1000);
  }

  finish() {
    this.done = true;
    this.running = false;
    this.stopTimer();
  }

  restart() {
    this.stopTimer();
    this.paragraph = this.paragraphs[Math.floor(Math.random() * this.paragraphs.length)];
    this.text = '';
    this.seconds = 60;
    this.running = false;
    this.done = false;
  }

  stopTimer() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }

  get wpm(): number {
    const elapsed = Math.max(1, 60 - this.seconds);
    return Math.round((this.correctChars / 5) / (elapsed / 60));
  }

  get accuracy(): number {
    return this.text.length ? Math.round((this.correctChars / this.text.length) * 100) : 100;
  }

  get correctChars(): number {
    return [...this.text].filter((char, i) => char === this.paragraph[i]).length;
  }
}
