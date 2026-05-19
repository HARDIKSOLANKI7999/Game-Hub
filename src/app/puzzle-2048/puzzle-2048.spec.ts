import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Puzzle2048 } from './puzzle-2048';

describe('Puzzle2048', () => {
  let component: Puzzle2048;
  let fixture: ComponentFixture<Puzzle2048>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Puzzle2048],
    }).compileComponents();

    fixture = TestBed.createComponent(Puzzle2048);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
