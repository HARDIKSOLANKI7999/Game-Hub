import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hanoi } from './hanoi';

describe('Hanoi', () => {
  let component: Hanoi;
  let fixture: ComponentFixture<Hanoi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hanoi],
    }).compileComponents();

    fixture = TestBed.createComponent(Hanoi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
