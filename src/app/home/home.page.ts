import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Paho } from '../../assets/js/paho-mqtt.js';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  private mqttStatus = 'Disconnected';
  private mqttClient: any = null;
  private message: any = '';
  private messageToSend = 'Type your message here.';
  private topic = 'swen325/a3';
  private clientId = '342323cwwerwe'; // this string must be unique to every client

  constructor(public navCtrl: NavController) {}

  public connect() {
    this.mqttStatus = 'Connecting...';
    this.mqttClient = new Paho.MQTT.Client(
      'barretts.ecs.vuw.ac.nz',
      8883,
      '/mqtt',
      this.clientId
    );

    // set callback handlers
    this.mqttClient.onConnectionLost = this.onConnectionLost;
    this.mqttClient.onMessageArrived = this.onMessageArrived;

    // connect the client
    console.log('Connecting to mqtt via websocket');
    this.mqttClient.connect({
      timeout: 10,
      useSSL: false,
      onSuccess: this.onConnect,
      onFailure: this.onFailure
    });
  }

  public disconnect() {
    if (this.mqttStatus == 'Connected') {
      this.mqttStatus = 'Disconnecting...';
      this.mqttClient.disconnect();
      this.mqttStatus = 'Disconnected';
    }
  }

  public sendMessage() {
    // tslint:disable-next-line: indent
    if (this.mqttStatus == 'Connected') {
      // tslint:disable-next-line: indent
      this.mqttClient.publish(this.topic, this.messageToSend);
    }
  }

  public onConnect = () => {
    console.log('Connected');
    this.mqttStatus = 'Connected';

    // subscribe
    this.mqttClient.subscribe(this.topic);
  };

  public onFailure = responseObject => {
    console.log('Failed to connect');
    this.mqttStatus = 'Failed to connect';
  };

  public onConnectionLost = responseObject => {
    if (responseObject.errorCode !== 0) {
      this.mqttStatus = 'Disconnected';
    }
  };

  public onMessageArrived = message => {
    console.log('Received message');
    this.message = message.payloadString;
  };
}

