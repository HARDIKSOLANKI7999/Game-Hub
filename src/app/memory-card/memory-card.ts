import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-memory-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './memory-card.html',
  styleUrl: './memory-card.css',
})
export class MemoryCard {
  constructor(
    private cd: ChangeDetectorRef
  ) { }
  cards: any[] = [];
  flippedCards: any[] = [];

  moves = 0;
  time = 0;
  timerInterval: any;

  won = false;

  // emojis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
//   emojis = [
//   '🍔','🍕','🍟','🍩',
//   '🍓','🍉','🍪','🧃'
// ];

emojis = [
  '❤️','💙','💚','💛',
  '🧡','💜','🖤','🤍'
];

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.moves = 0;
    this.time = 0;
    this.won = false;

    this.startTimer();

    const pairs = [...this.emojis, ...this.emojis];

    this.cards = pairs
      .sort(() => Math.random() - 0.5)
      .map(v => ({
        value: v,
        flipped: false,
        matched: false
      }));
  }

  startTimer() {

    clearInterval(this.timerInterval);

    this.time = 0;

    this.timerInterval = setInterval(() => {

      this.time++;

      this.cd.detectChanges();

    }, 1000);
  }

  flipCard(index: number) {
    const card = this.cards[index];

    if (card.flipped || card.matched || this.flippedCards.length === 2) return;

    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.moves++;

      const [a, b] = this.flippedCards;

      if (a.value === b.value) {
        a.matched = b.matched = true;
        this.flippedCards = [];

        this.checkWin();
      } else {
        setTimeout(() => {
          a.flipped = b.flipped = false;
          this.flippedCards = [];
        }, 800);
      }
    }
  }

  checkWin() {
    if (this.cards.every(c => c.matched)) {
      this.won = true;
      clearInterval(this.timerInterval);
    }
  }
}
