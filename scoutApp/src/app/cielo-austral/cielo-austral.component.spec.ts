import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CieloAustralComponent } from './cielo-austral.component';

describe('CieloAustralComponent', () => {
  let component: CieloAustralComponent;
  let fixture: ComponentFixture<CieloAustralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CieloAustralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CieloAustralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
