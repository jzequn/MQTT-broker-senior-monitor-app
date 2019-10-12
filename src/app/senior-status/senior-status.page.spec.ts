import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorStatusPage } from './senior-status.page';

describe('SeniorStatusPage', () => {
  let component: SeniorStatusPage;
  let fixture: ComponentFixture<SeniorStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeniorStatusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeniorStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
