import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type Player = 'red' | 'yellow';
type Cell = Player | null;

@Component({
  selector: 'app-connect-four',
  imports: [CommonModule],
  templateUrl: './connect-four.html',
  styleUrl: './connect-four.css',
})
export class ConnectFour {
  readonly rows = 6;
  readonly cols = 7;
  board: Cell[] = [];
  currentPlayer: Player = 'red';
  winner: Player | 'draw' | null = null;

  ngOnInit() {
    this.restart();
  }

  drop(col: number) {
    if (this.winner) return;

    for (let row = this.rows - 1; row >= 0; row--) {
      const index = this.index(row, col);

      if (!this.board[index]) {
        this.board[index] = this.currentPlayer;
        this.winner = this.findWinner(row, col) || (this.board.every(Boolean) ? 'draw' : null);
        if (!this.winner) this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
        return;
      }
    }
  }

  findWinner(row: number, col: number): Player | null {
    const player = this.board[this.index(row, col)];
    const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];

    for (const [dr, dc] of dirs) {
      let count = 1;
      count += this.count(row, col, dr, dc, player);
      count += this.count(row, col, -dr, -dc, player);
      if (count >= 4) return player;
    }

    return null;
  }

  count(row: number, col: number, dr: number, dc: number, player: Cell): number {
    let total = 0;
    row += dr;
    col += dc;

    while (row >= 0 && row < this.rows && col >= 0 && col < this.cols && this.board[this.index(row, col)] === player) {
      total++;
      row += dr;
      col += dc;
    }

    return total;
  }

  index(row: number, col: number): number {
    return row * this.cols + col;
  }

  restart() {
    this.board = Array(this.rows * this.cols).fill(null);
    this.currentPlayer = 'red';
    this.winner = null;
  }
}
