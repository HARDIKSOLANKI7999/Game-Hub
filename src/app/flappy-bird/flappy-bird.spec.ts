import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlappyBird } from './flappy-bird';

describe('FlappyBird', () => {
  let component: FlappyBird;
  let fixture: ComponentFixture<FlappyBird>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlappyBird],
    }).compileComponents();

    fixture = TestBed.createComponent(FlappyBird);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
