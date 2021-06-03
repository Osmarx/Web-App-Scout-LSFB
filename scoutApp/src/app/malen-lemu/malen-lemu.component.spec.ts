import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MalenLemuComponent } from './malen-lemu.component';

describe('MalenLemuComponent', () => {
  let component: MalenLemuComponent;
  let fixture: ComponentFixture<MalenLemuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MalenLemuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MalenLemuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
