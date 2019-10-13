import { Injectable } from "@angular/core";
import Paho from "../assets/js/paho-mqtt.js";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export default class MqqtConnectionService {
  private messageSubject = new Subject<any>();
  private mqttStatusSubject = new Subject<any>();
  private mqttStatus = "Disconnected";
  private mqttClient: any = null;
  public message: any = "";
  public messageList: string[] = [];
  public messageListSubject = new Subject<any[]>();
  public messageToSend = "";
  private topic = "swen325/a3";
  private clientId = "342323cwwerwe3"; // this string must be unique to every client

  constructor() {}

  private tokenList: any[] = [];
  parseMessageList() {
    this.messageList.map(message => {
      const tokens = message.split(",", 5);
      this.tokenList.concat(tokens);
      console.log(tokens);
    });
  }

  connect() {
    this.mqttStatus = "Connecting...";
    this.mqttStatusSubject.next(this.mqttStatus);
    this.mqttClient = new Paho.Client(
      // 'barretts.ecs.vuw.ac.nz',
      "localhost",
      8883,
      "/mqtt",
      this.clientId
    );

    // set callback handlers
    this.mqttClient.onConnectionLost = this.onConnectionLost;
    this.mqttClient.onMessageArrived = this.onMessageArrived;

    // connect the client
    console.log("Connecting to mqtt via websocket");
    this.mqttClient.connect({
      timeout: 10,
      useSSL: false,
      onSuccess: this.onConnect,
      onFailure: this.onFailure
    });
  }

  disconnect() {
    if (this.mqttStatus === "Connected") {
      this.mqttStatus = "Disconnecting...";
      this.mqttStatusSubject.next(this.mqttStatus);
      this.mqttClient.disconnect();
      this.mqttStatus = "Disconnected";
      this.mqttStatusSubject.next(this.mqttStatus);
      console.log("disconnect done!");
    }
  }

  sendMessage() {
    // tslint:disable-next-line: indent
    if (this.mqttStatus === "Connected") {
      // tslint:disable-next-line: indent
      this.mqttClient.publish(this.topic, this.messageToSend);
    }
  }

  // send message
  sendMessageWithParams(messageToSend: string) {
    // tslint:disable-next-line: indent
    if (this.mqttStatus === "Connected") {
      // tslint:disable-next-line: indent
      this.mqttClient.publish(this.topic, messageToSend);
    }
  }

  onConnect = () => {
    console.log("Connected");
    this.mqttStatus = "Connected";
    this.mqttStatusSubject.next(this.mqttStatus);
    // subscribe
    this.mqttClient.subscribe(this.topic);
  };

  onFailure = responseObject => {
    console.log("Failed to connect");
    this.mqttStatus = "Failed to connect";
  };

  onConnectionLost = responseObject => {
    if (responseObject.errorCode !== 0) {
      this.mqttStatus = "Disconnected";
    }
  };

  onMessageArrived = message => {
    console.log("Received message");
    // one message
    this.message = message.payloadString;
    this.messageSubject.next(this.message);

    // message list
    // console.log('onMessageArrived-messageList');

    this.messageList.push(message.payloadString);
    this.messageListSubject.next(this.messageList);
    // console.log('onMessageArrived-messagelist',this.messageList);
    // console.log('onMessageArrived-message.payloadString',message.payloadString);
    // console.log('messageList length',this.messageList.length)
    this.parseMessageList();
  };

  // get one message
  getMessage() {
    return this.messageSubject.asObservable();
  }

  // get mqtt status
  getMQTTStatus() {
    return this.mqttStatusSubject.asObservable();
  }

  // get message list
  getMessageList() {
    return this.messageListSubject.asObservable();
  }
}
