import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttBrokerPage } from './mqtt-broker.page';

describe('MqttBrokerPage', () => {
  let component: MqttBrokerPage;
  let fixture: ComponentFixture<MqttBrokerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MqttBrokerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttBrokerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
