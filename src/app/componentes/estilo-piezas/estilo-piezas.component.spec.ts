import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstiloPiezasComponent } from './estilo-piezas.component';

describe('EstiloPiezasComponent', () => {
  let component: EstiloPiezasComponent;
  let fixture: ComponentFixture<EstiloPiezasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstiloPiezasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstiloPiezasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
