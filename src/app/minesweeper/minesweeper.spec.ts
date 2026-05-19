import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Minesweeper } from './minesweeper';

describe('Minesweeper', () => {
  let component: Minesweeper;
  let fixture: ComponentFixture<Minesweeper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Minesweeper],
    }).compileComponents();

    fixture = TestBed.createComponent(Minesweeper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
