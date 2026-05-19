import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-word-search',
  imports: [CommonModule],
  templateUrl: './word-search.html',
  styleUrl: './word-search.css',
})
export class WordSearch {
  readonly size = 10;
  readonly words = ['ANGULAR', 'CODE', 'GAME', 'LOGIC', 'PUZZLE'];
  grid: string[] = [];
  selected: number[] = [];
  found = new Set<string>();

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.grid = Array(this.size * this.size).fill('');
    this.selected = [];
    this.found.clear();
    this.words.forEach(word => this.place(word));
    this.grid = this.grid.map(letter => letter || this.randomLetter());
  }

  pick(index: number) {
    if (this.selected.includes(index)) this.selected = this.selected.filter(i => i !== index);
    else this.selected.push(index);

    const text = this.selected.map(i => this.grid[i]).join('');
    const reverse = [...text].reverse().join('');
    const word = this.words.find(w => w === text || w === reverse);

    if (word) {
      this.found.add(word);
      this.selected = [];
    }
  }

  place(word: string) {
    const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (let tries = 0; tries < 80; tries++) {
      const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
      const row = Math.floor(Math.random() * this.size);
      const col = Math.floor(Math.random() * this.size);
      const cells = [...word].map((_, i) => [row + dr * i, col + dc * i]);

      if (cells.every(([r, c], i) => this.fits(r, c, word[i]))) {
        cells.forEach(([r, c], i) => this.grid[this.index(r, c)] = word[i]);
        return;
      }
    }
  }

  fits(row: number, col: number, letter: string): boolean {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) return false;
    const cell = this.grid[this.index(row, col)];
    return !cell || cell === letter;
  }

  index(row: number, col: number): number {
    return row * this.size + col;
  }

  randomLetter(): string {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }
}
