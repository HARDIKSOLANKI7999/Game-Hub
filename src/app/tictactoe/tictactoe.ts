import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tictactoe',
  imports: [CommonModule, RouterModule],
  templateUrl: './tictactoe.html',
  styleUrl: './tictactoe.css',
})
export class Tictactoe {
  board: string[] = Array(9).fill('');
  currentPlayer: string = 'X';
  winner: string | null = null;

  winningPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  makeMove(index: number) {
    if (this.board[index] || this.winner) return;

    this.board[index] = this.currentPlayer;

    if (this.checkWinner()) {
      this.winner = this.currentPlayer;
      return;
    }

    if (!this.board.includes('')) {
      this.winner = 'Draw';
      return;
    }

    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  checkWinner(): boolean {
    return this.winningPatterns.some(pattern => {
      const [a, b, c] = pattern;
      return this.board[a] &&
             this.board[a] === this.board[b] &&
             this.board[a] === this.board[c];
    });
  }

  restart() {
    this.board = Array(9).fill('');
    this.currentPlayer = 'X';
    this.winner = null;
  }
}
