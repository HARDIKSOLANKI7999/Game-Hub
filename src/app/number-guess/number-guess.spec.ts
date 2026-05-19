import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberGuess } from './number-guess';

describe('NumberGuess', () => {
  let component: NumberGuess;
  let fixture: ComponentFixture<NumberGuess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberGuess],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberGuess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
