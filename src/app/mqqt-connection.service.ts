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

  private lastDetectedMotion = new Map(); // motion is either 1 or 0
  // private timeDifference = new Date();
  private timeDifference: Date;
  public lastDetectedMotionSubject = new Subject<any>();
  public timeDifferenceSubject = new Subject<any>();

  private batteries = new Map();
  private batteriesSubject = new Subject<any>();
  constructor() {}

  private tokenList: any[] = [];
  parseMessageList() {
    this.messageList.map(message => {
      const tokens = message.split(",", 5);
      this.tokenList.concat(tokens);
      console.log(tokens);
    });
  }

  // this will calculate the time difference between current motion and lastDetectedMotion
  calculateTimeDifference(
    previousMotionTime: string,
    currentMotionTime: string
  ) {
    const previous = new Date(Date.parse(previousMotionTime));
    const current = new Date(Date.parse(currentMotionTime));
    const difference = new Date(Number(+current - +previous)); // use this date to get the time difference with format hh:mm:ss
    // console.log("difference - calculate differece", difference);
    this.timeDifference = difference;
    this.timeDifferenceSubject.next(this.timeDifference);
  }

  // this will record motion corresponding time
  detectMotion() {
    this.messageList.map(message => {
      const tokens = message.split(",", 5);
      const motion = tokens[2];
      const time = tokens[0];
      const place = tokens[1];
      // if current has no motion
      if (motion === "0") {
        // compare current motion time with time of lastDetectedMotion, which is either 1 or 0
        // if lastDetectedMotion has no record
        if (this.lastDetectedMotion.size === 0) {
          this.lastDetectedMotion.set(motion, time);
          this.lastDetectedMotionSubject.next(this.lastDetectedMotion);
        } else {
          if (this.lastDetectedMotion.has("0")) {
            // last detected motion is 0
            // calculate time difference
            this.calculateTimeDifference(
              this.lastDetectedMotion.get("0"),
              time
            );
            // console.log(
            //   "detect motion, motion set is:",
            //   this.lastDetectedMotion
            // );
          } else {
            // last detected motion is 1
            // calculate time difference
            this.calculateTimeDifference(
              this.lastDetectedMotion.get("1"),
              time
            );
            // console.log(
            //   "detect motion, motion set is:",
            //   this.lastDetectedMotion
            // );
          }
        }
      } else {
        // if current has motion
        // last detected motion is empty
        if (this.lastDetectedMotion.size === 0) {
          // assign current motion to lastDetectedMotion
          this.lastDetectedMotion.set(motion, time);
          this.lastDetectedMotionSubject.next(this.lastDetectedMotion);
        } else {
          if (this.lastDetectedMotion.has("0")) {
            // last detected motion is 0
            // calculate time difference, update the motion and time
            this.calculateTimeDifference(
              this.lastDetectedMotion.get("0"),
              time
            );

            this.lastDetectedMotion.clear();
            this.lastDetectedMotion.set(motion, time);
            // console.log(
            //   "detect motion, motion set is:",
            //   this.lastDetectedMotion
            // );
            this.lastDetectedMotionSubject.next(this.lastDetectedMotion);
          } else {
            // last detected motion is 1
            // calculate time difference, update the motion and time
            this.calculateTimeDifference(
              this.lastDetectedMotion.get("1"),
              time
            );
            this.lastDetectedMotion.set(motion, time);
            this.lastDetectedMotion.set("place", place);
            // console.log(
            //   "detect motion, motion set is:",
            //   this.lastDetectedMotion
            // );
            this.lastDetectedMotionSubject.next(this.lastDetectedMotion);
          }
        }
      }
    });
  }

  calculateOccurenceOfPlace(message: string) {
    const tokens = message.split(",", 5);
    const motion = tokens[2];
    const place = tokens[1];
    if (motion === "1") {
      // if motion detected, add it to lastDetectedMotion
      if (this.lastDetectedMotion.has(place)) {
        this.lastDetectedMotion.set(
          place,
          this.lastDetectedMotion.get(place) + 1
        );
      } else {
        this.lastDetectedMotion.set(place, 1);
      }
    }
  }

  checkBatteries() {
    const list = this.messageList.slice(Math.max(this.messageList.length-5, 0));
    console.log("checkbatteries mqtt, list", list);
    list.map(m => {
      const tokens = m.split(",", 5);
      const place = tokens[1];
      const battery = tokens[3];

      this.batteries.set(place, battery);
      console.log("batteries", this.batteries);
    });
    this.batteriesSubject.next(this.batteries);
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
    console.log("On message arrived - Received message");
    // one message, store one message
    this.message = message.payloadString;
    this.messageSubject.next(this.message);

    // message list, push all the message to message list

    this.messageList.push(message.payloadString);
    this.messageListSubject.next(this.messageList);
    // console.log("on message arrived - detectMotion ()");
    this.detectMotion();
    console.log("on message arrived - calculateOccurenceOfPlace(message)");
    this.calculateOccurenceOfPlace(message.payloadString);
    this.checkBatteries();
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

  getLastDetectedMotion() {
    return this.lastDetectedMotionSubject.asObservable();
  }
  getTimeDifference() {
    return this.timeDifferenceSubject.asObservable();
  }
  getBatteries() {
    return this.batteriesSubject.asObservable();
  }
}
