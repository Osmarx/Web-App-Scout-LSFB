import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampamentosComponent } from './campamentos.component';

describe('CampamentosComponent', () => {
  let component: CampamentosComponent;
  let fixture: ComponentFixture<CampamentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampamentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
