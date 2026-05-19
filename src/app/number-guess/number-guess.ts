import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-number-guess',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './number-guess.html',
  styleUrl: './number-guess.css',
})
export class NumberGuess {
  secretNumber = 0;
  guess: number | null = null;
  message = 'Start guessing...';
  messageType = '';
  attempts = 0;
  timer = 0;
  bestScore: number | null = null;
  timerInterval: ReturnType<typeof setInterval> | null = null;
  solved = false;

  ngOnInit() {
    this.bestScore = Number(localStorage.getItem('best-score')) || null;
    this.restartGame();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timer = 0;
    this.timerInterval = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  checkGuess() {
    if (this.guess === null || this.solved) return;

    if (this.guess < 1 || this.guess > 100) {
      this.message = 'Enter a number from 1 to 100';
      this.messageType = 'high';
      this.guess = null;
      return;
    }

    this.attempts++;

    if (this.guess === this.secretNumber) {
      this.message = 'PERFECT GUESS';
      this.messageType = 'success';
      this.solved = true;

      if (this.timerInterval) clearInterval(this.timerInterval);

      if (!this.bestScore || this.attempts < this.bestScore) {
        this.bestScore = this.attempts;
        localStorage.setItem('best-score', this.bestScore.toString());
      }
    } else if (this.guess > this.secretNumber) {
      this.message = 'TOO HIGH';
      this.messageType = 'high';
    } else {
      this.message = 'TOO LOW';
      this.messageType = 'low';
    }

    this.guess = null;
  }

  restartGame() {
    this.secretNumber = Math.floor(Math.random() * 100) + 1;
    this.guess = null;
    this.attempts = 0;
    this.solved = false;
    this.message = 'Start guessing...';
    this.messageType = '';
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}
