import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmuillanComponent } from './amuillan.component';

describe('AmuillanComponent', () => {
  let component: AmuillanComponent;
  let fixture: ComponentFixture<AmuillanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmuillanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmuillanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
