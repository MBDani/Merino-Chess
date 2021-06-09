import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerVScomputerComponent } from './player-vs-computer.component';

describe('PlayerVScomputerComponent', () => {
  let component: PlayerVScomputerComponent;
  let fixture: ComponentFixture<PlayerVScomputerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerVScomputerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerVScomputerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
