import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiesSigilososComponent } from './pies-sigilosos.component';

describe('PiesSigilososComponent', () => {
  let component: PiesSigilososComponent;
  let fixture: ComponentFixture<PiesSigilososComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiesSigilososComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiesSigilososComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
