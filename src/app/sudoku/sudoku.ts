import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type Cell = { value: number | null; fixed: boolean };

@Component({
  selector: 'app-sudoku',
  imports: [CommonModule],
  templateUrl: './sudoku.html',
  styleUrl: './sudoku.css',
})
export class Sudoku {
  board: Cell[] = [];
  solution: number[] = [];
  selected = -1;
  mistakes = 0;
  message = 'Fill the empty cells from 1 to 9.';

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.solution = this.makeSolution();
    const puzzle = [...this.solution];
    this.shuffle([...Array(81).keys()]).slice(0, 42).forEach(i => puzzle[i] = 0);
    this.board = puzzle.map(value => ({ value: value || null, fixed: !!value }));
    this.selected = -1;
    this.mistakes = 0;
    this.message = 'Fill the empty cells from 1 to 9.';
  }

  setCell(index: number, raw: string) {
    if (this.board[index].fixed) return;

    const value = Number(raw.replace(/\D/g, '').slice(-1)) || null;
    this.board[index].value = value && value <= 9 ? value : null;
    this.selected = index;

    if (!value) {
      this.message = 'Cell cleared.';
      return;
    }

    if (this.hasConflict(index) || value !== this.solution[index]) {
      this.mistakes++;
      this.message = 'That number does not fit here.';
      return;
    }

    this.message = this.isComplete() ? 'Solved. Nice work!' : 'Good move.';
  }

  clearCell(index: number) {
    if (!this.board[index].fixed) this.setCell(index, '');
  }

  hasConflict(index: number): boolean {
    const value = this.board[index].value;
    if (!value) return false;

    return this.peers(index).some(i => this.board[i].value === value);
  }

  isBad(index: number): boolean {
    const value = this.board[index].value;
    return !!value && !this.board[index].fixed && (this.hasConflict(index) || value !== this.solution[index]);
  }

  isComplete(): boolean {
    return this.board.every((cell, i) => cell.value === this.solution[i]);
  }

  makeSolution(): number[] {
    const rows = this.shuffleGroups();
    const cols = this.shuffleGroups();
    const nums = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    return rows.flatMap(r =>
      cols.map(c => nums[(r * 3 + Math.floor(r / 3) + c) % 9])
    );
  }

  shuffleGroups(): number[] {
    return this.shuffle([0, 1, 2]).flatMap(group =>
      this.shuffle([0, 1, 2]).map(offset => group * 3 + offset)
    );
  }

  shuffle<T>(items: T[]): T[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  peers(index: number): number[] {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    const peers = new Set<number>();

    for (let i = 0; i < 9; i++) {
      peers.add(row * 9 + i);
      peers.add(i * 9 + col);
      peers.add((boxRow + Math.floor(i / 3)) * 9 + boxCol + (i % 3));
    }

    peers.delete(index);
    return [...peers];
  }
}
