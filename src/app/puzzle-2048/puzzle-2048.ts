import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-puzzle-2048',
  imports: [CommonModule],
  templateUrl: './puzzle-2048.html',
  styleUrl: './puzzle-2048.css',
})
export class Puzzle2048 {
  board: number[] = [];
  score = 0;
  won = false;
  gameOver = false;
  bestScore = 0;

  ngOnInit() {
    this.bestScore = Number(localStorage.getItem('best2048')) || 0;
    this.startGame();
  }

  startGame() {
    this.board = Array(16).fill(0);
    this.score = 0;
    this.won = false;
    this.gameOver = false;
    this.addTile();
    this.addTile();
  }

  addTile() {
    const empty = this.board
      .map((v, i) => v === 0 ? i : -1)
      .filter(i => i !== -1);

    if (!empty.length) return;

    const rand = empty[Math.floor(Math.random() * empty.length)];
    this.board[rand] = Math.random() > 0.8 ? 4 : 2;
  }

  move(direction: string) {
    if (this.gameOver || this.won) return;

    const oldBoard = [...this.board];

    for (let i = 0; i < 4; i++) {
      let row = this.getRow(i, direction);
      row = this.slide(row);
      row = this.merge(row);
      row = this.slide(row);
      this.setRow(i, row, direction);
    }

    if (this.board.toString() !== oldBoard.toString()) {
      this.addTile();
      this.gameOver = this.isGameOver();
    }
  }

  slide(row: number[]) {
    return row.filter(v => v).concat(Array(4).fill(0)).slice(0, 4);
  }

  merge(row: number[]) {
    for (let i = 0; i < 3; i++) {
      if (row[i] && row[i] === row[i + 1]) {
        row[i] *= 2;
        this.score += row[i];
        if (this.score > this.bestScore) {
          this.bestScore = this.score;
          localStorage.setItem('best2048', this.bestScore.toString());
        }
        row[i + 1] = 0;

        if (row[i] === 2048) this.won = true;
      }
    }
    return row;
  }

  getRow(i: number, dir: string): number[] {
    const row = [];

    for (let j = 0; j < 4; j++) {
      let index;

      if (dir === 'left') index = i * 4 + j;
      if (dir === 'right') index = i * 4 + (3 - j);
      if (dir === 'up') index = j * 4 + i;
      if (dir === 'down') index = (3 - j) * 4 + i;

      row.push(this.board[index!]);
    }

    return row;
  }

  setRow(i: number, row: number[], dir: string) {
    for (let j = 0; j < 4; j++) {
      let index;

      if (dir === 'left') index = i * 4 + j;
      if (dir === 'right') index = i * 4 + (3 - j);
      if (dir === 'up') index = j * 4 + i;
      if (dir === 'down') index = (3 - j) * 4 + i;

      this.board[index!] = row[j];
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (!event.key.startsWith('Arrow')) return;
    event.preventDefault();

    switch (event.key) {
      case 'ArrowLeft': this.move('left'); break;
      case 'ArrowRight': this.move('right'); break;
      case 'ArrowUp': this.move('up'); break;
      case 'ArrowDown': this.move('down'); break;
    }
  }

  isGameOver(): boolean {
    if (this.board.includes(0)) return false;

    for (let i = 0; i < 16; i++) {
      const val = this.board[i];

      if (i % 4 !== 3 && val === this.board[i + 1]) return false;
      if (i < 12 && val === this.board[i + 4]) return false;
    }

    return true;
  }
}
