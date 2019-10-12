import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import MqqtConnectionService from '../mqqt-connection.service';
@Component({
  selector: 'app-mqtt-broker',
  templateUrl: './mqtt-broker.page.html',
  styleUrls: ['./mqtt-broker.page.scss'],
})
export class MqttBrokerPage implements OnInit {

  constructor(private mqtt:MqqtConnectionService) { }

  private message = '';
  private messageToSend = '';
  private messageSubscription : Subscription;
  private messageList : any[]=[];
  private messageListSubscription: Subscription;
  private mqttStatus = 'Disconnected';
  private mqttStatusSubscription: Subscription;
  ngOnInit() {
    // this.mqtt = new MqqtConnectionService();
    this.messageSubscription = this.mqtt.getMessage().subscribe(message=>{
      this.message = message;
    });
    this.mqttStatusSubscription = this.mqtt.getMQTTStatus().subscribe(status=>{
      this.mqttStatus = status;
    })
    this.messageListSubscription = this.mqtt.getMessageList().subscribe(list=>{
      if(list!= null){
        this.messageList = list;
      }

    })
  }
  ngOnDestroy(){
    this.messageSubscription.unsubscribe();
    this.mqttStatusSubscription.unsubscribe();
    this.messageListSubscription.unsubscribe();
  }
  connect(){
    this.mqtt.connect();
  }
  disconnect(){
    this.mqtt.disconnect();
  }
  sendMessage(){
    this.mqtt.sendMessageWithParams(this.messageToSend);
    this.messageToSend = '';
  }
}
