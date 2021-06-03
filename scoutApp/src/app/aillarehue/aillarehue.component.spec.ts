import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AillarehueComponent } from './aillarehue.component';

describe('AillarehueComponent', () => {
  let component: AillarehueComponent;
  let fixture: ComponentFixture<AillarehueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AillarehueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AillarehueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
