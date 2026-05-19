import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-minesweeper',
  imports: [CommonModule, FormsModule],
  templateUrl: './minesweeper.html',
  styleUrl: './minesweeper.css',
})

export class Minesweeper {
  rows = 14;
  cols = 14;

  mines = 30;

  flagsLeft = 30;

  board: any[] = [];

  gameOver = false;

  won = false;

  difficulty = 'hard';

  timer = 0;

  interval: any;

  ngOnInit() {
    this.startGame();
  }

  startGame() {

    clearInterval(this.interval);

    this.timer = 0;

    this.interval = setInterval(() => {
      if (!this.gameOver) {
        this.timer++;
      }
    }, 1000);

    this.gameOver = false;

    this.won = false;

    this.flagsLeft = this.mines;

    this.board = [];

    // CREATE CELLS
    for (let i = 0; i < this.rows * this.cols; i++) {

      this.board.push({
        mine: false,
        revealed: false,
        flagged: false,
        count: 0
      });
    }

    // PLACE MINES
    let placed = 0;

    while (placed < this.mines) {

      const random =
        Math.floor(Math.random() * this.board.length);

      if (!this.board[random].mine) {

        this.board[random].mine = true;

        placed++;
      }
    }

    // COUNTS
    for (let i = 0; i < this.board.length; i++) {

      this.board[i].count =
        this.getNeighbors(i)
        .filter(n => this.board[n].mine)
        .length;
    }
  }

  changeDifficulty() {

    if (this.difficulty === 'easy') {

      this.rows = 10;
      this.cols = 10;
      this.mines = 15;
    }

    else if (this.difficulty === 'medium') {

      this.rows = 12;
      this.cols = 12;
      this.mines = 22;
    }

    else {

      this.rows = 14;
      this.cols = 14;
      this.mines = 30;
    }

    this.startGame();
  }

  getNeighbors(index: number) {

    const neighbors = [];

    const row =
      Math.floor(index / this.cols);

    const col =
      index % this.cols;

    for (let r = -1; r <= 1; r++) {

      for (let c = -1; c <= 1; c++) {

        if (r === 0 && c === 0) continue;

        const nr = row + r;
        const nc = col + c;

        if (
          nr >= 0 &&
          nr < this.rows &&
          nc >= 0 &&
          nc < this.cols
        ) {

          neighbors.push(
            nr * this.cols + nc
          );
        }
      }
    }

    return neighbors;
  }

  revealCell(index: number) {

    const cell = this.board[index];

    if (
      this.gameOver ||
      cell.flagged ||
      cell.revealed
    ) return;

    cell.revealed = true;

    // MINE
    if (cell.mine) {

      this.gameOver = true;

      this.won = false;

      this.board.forEach(c => {

        if (c.mine) {
          c.revealed = true;
        }
      });

      return;
    }

    // EMPTY
    if (cell.count === 0) {

      this.getNeighbors(index)
      .forEach(n => {

        if (!this.board[n].revealed) {

          this.revealCell(n);
        }
      });
    }

    this.checkWin();
  }

  toggleFlag(event: MouseEvent, index: number) {

    event.preventDefault();

    const cell = this.board[index];

    if (
      this.gameOver ||
      cell.revealed ||
      (!cell.flagged && this.flagsLeft === 0)
    ) return;

    cell.flagged = !cell.flagged;

    this.flagsLeft +=
      cell.flagged ? -1 : 1;
  }

  checkWin() {

    const revealed =
      this.board.filter(
        c =>
          c.revealed &&
          !c.mine
      ).length;

    if (
      revealed ===
      this.rows * this.cols - this.mines
    ) {

      this.gameOver = true;

      this.won = true;
    }
  }

  getRevealedColor(cell: any): string {

    if (cell.mine) return '#ef4444';

    return '#d6b899';
  }

  getNumberColor(num: number): string {

    const colors: any = {

      1: '#2563eb',
      2: '#16a34a',
      3: '#dc2626',
      4: '#9333ea',
      5: '#f59e0b',
      6: '#06b6d4',
      7: '#ec4899',
      8: '#ffffff'
    };

    return colors[num];
  }
}
