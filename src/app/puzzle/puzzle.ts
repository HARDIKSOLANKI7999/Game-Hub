import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-puzzle',
  imports: [CommonModule],
  templateUrl: './puzzle.html',
  styleUrl: './puzzle.css',
})

export class Puzzle {
  
  tiles: number[] = [];
  moves = 0;
  won = false;

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.moves = 0;
    this.won = false;

    this.tiles = [...Array(15).keys()].map(x => x + 1);
    this.tiles.push(0); // empty

    this.shuffle();
  }

  shuffle() {
    do {
      for (let i = 0; i < 1000; i++) {
        const rand = Math.floor(Math.random() * 16);
        this.moveTile(rand, false);
      }
    } while (this.isSolved());

    this.moves = 0;
    this.won = false;
  }

  moveTile(index: number, isPlayerMove = true) {
    if (this.won && isPlayerMove) return;

    const emptyIndex = this.tiles.indexOf(0);

    const validMoves = [
      emptyIndex - 1,
      emptyIndex + 1,
      emptyIndex - 4,
      emptyIndex + 4
    ];

    if (!validMoves.includes(index)) return;

    // row boundary fix
    if (Math.abs(emptyIndex - index) === 1 &&
      Math.floor(emptyIndex / 4) !== Math.floor(index / 4)) {
      return;
    }

    [this.tiles[emptyIndex], this.tiles[index]] =
      [this.tiles[index], this.tiles[emptyIndex]];

    if (!isPlayerMove) return;

    this.moves++;
    this.won = this.isSolved();
  }

  isSolved(): boolean {
    for (let i = 0; i < 15; i++) {
      if (this.tiles[i] !== i + 1) return false;
    }
    return true;
  }

  checkWin() {
    this.won = this.isSolved();
  }
}
