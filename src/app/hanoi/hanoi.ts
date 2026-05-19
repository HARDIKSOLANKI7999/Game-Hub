import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

type RodKey = 'A' | 'B' | 'C';

@Component({
  selector: 'app-hanoi',
  imports: [CommonModule, RouterModule],
  templateUrl: './hanoi.html',
  styleUrl: './hanoi.css',
})
export class Hanoi {
  rods: { A: number[]; B: number[]; C: number[] } = {
    A: [],
    B: [],
    C: []
  };

  selectedRod: RodKey | null = null;
  diskCount = 3;
  moves = 0;
  draggedFrom: RodKey | null = null;
  showWinPopup = false;
  statusMessage = 'Move one disk at a time. Smaller disks must stay on top.';

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.moves = 0;
    this.selectedRod = null;
    this.draggedFrom = null;
    this.showWinPopup = false;
    this.statusMessage = 'Move one disk at a time. Smaller disks must stay on top.';
    this.rods = { A: [], B: [], C: [] };

    for (let i = this.diskCount; i >= 1; i--) {
      this.rods.A.push(i);
    }
  }

  selectRod(rod: RodKey) {
    if (!this.selectedRod) {
      if (this.rods[rod].length === 0) {
        this.statusMessage = 'Pick a rod that has a disk.';
        return;
      }

      this.selectedRod = rod;
      this.statusMessage = `Rod ${rod} selected. Choose a destination.`;
      return;
    }

    this.moveDisk(this.selectedRod, rod);
    this.selectedRod = null;
  }

  moveDisk(from: RodKey, to: RodKey) {
    const fromRod = this.rods[from];
    const toRod = this.rods[to];

    if (fromRod.length === 0) return;

    const disk = fromRod[fromRod.length - 1];

    if (toRod.length === 0 || toRod[toRod.length - 1] > disk) {
      toRod.push(fromRod.pop()!);
      this.moves++;
      this.statusMessage = `Moved disk ${disk} from ${from} to ${to}.`;
      this.checkWin();
      return;
    }

    this.statusMessage = 'Invalid move. A larger disk cannot sit on a smaller disk.';
  }

  checkWin() {
    if (this.rods.C.length === this.diskCount) {
      this.showWinPopup = true;
    }
  }

  getColor(disk: number): string {
    const colors = [
      '#ef4444',
      '#f59e0b',
      '#10b981',
      '#3b82f6',
      '#a855f7',
      '#ec4899',
      '#14b8aa',
    ];
    return colors[disk % colors.length];
  }

  changeDisks(val: number) {
    this.diskCount += val;

    if (this.diskCount < 3) this.diskCount = 3;
    if (this.diskCount > 8) this.diskCount = 8;

    this.startGame();
  }

  onDragStart(from: RodKey) {
    const rod = this.rods[from];

    if (rod.length === 0) return;

    this.draggedFrom = from;
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(to: RodKey) {
    if (!this.draggedFrom) return;

    this.moveDisk(this.draggedFrom, to);
    this.draggedFrom = null;
  }

  getMinMoves(): number {
    return Math.pow(2, this.diskCount) - 1;
  }

  restartGame() {
    this.startGame();
  }
}
