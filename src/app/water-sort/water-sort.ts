import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type Color = 'red' | 'blue' | 'green' | 'yellow';

@Component({
  selector: 'app-water-sort',
  imports: [CommonModule],
  templateUrl: './water-sort.html',
  styleUrl: './water-sort.css',
})
export class WaterSort {
  readonly capacity = 4;
  readonly level: Color[][] = [
    ['red', 'blue', 'green', 'yellow'],
    ['green', 'red', 'yellow', 'blue'],
    ['blue', 'green', 'red', 'yellow'],
    ['yellow', 'blue', 'green', 'red'],
    [],
    [],
  ];

  tubes: Color[][] = [];
  selected: number | null = null;
  message = 'Pick a tube, then pick where to pour.';

  ngOnInit() {
    this.restart();
  }

  pick(index: number) {
    if (this.solved) return;

    if (this.selected === null) {
      if (this.tubes[index].length) this.selected = index;
      return;
    }

    if (this.selected === index) {
      this.selected = null;
      return;
    }

    this.pour(this.selected, index);
    this.selected = null;
  }

  pour(from: number, to: number) {
    const source = this.tubes[from];
    const target = this.tubes[to];
    const color = source[source.length - 1];

    if (!color || target.length === this.capacity || (target.length && target[target.length - 1] !== color)) {
      this.message = 'That pour is not allowed.';
      return;
    }

    while (
      source[source.length - 1] === color &&
      target.length < this.capacity
    ) {
      target.push(source.pop()!);
    }

    this.message = this.solved ? 'Puzzle solved.' : 'Good pour.';
  }

  get solved(): boolean {
    return this.tubes.every(tube =>
      !tube.length || (tube.length === this.capacity && tube.every(color => color === tube[0]))
    );
  }

  restart() {
    this.tubes = this.level.map(tube => [...tube]);
    this.selected = null;
    this.message = 'Pick a tube, then pick where to pour.';
  }
}
