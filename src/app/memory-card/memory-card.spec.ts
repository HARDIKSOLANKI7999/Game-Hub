import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoryCard } from './memory-card';

describe('MemoryCard', () => {
  let component: MemoryCard;
  let fixture: ComponentFixture<MemoryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemoryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(MemoryCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
