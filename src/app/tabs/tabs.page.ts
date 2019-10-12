import { Component, OnInit } from '@angular/core';
import MQttService from '../mqqt-connection.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  private listSubscription : Subscription;
  private badgeNum;
  constructor(private mqtt:MQttService) { }

  ngOnInit() {
    // this.mqtt = new MQttService();
    this.listSubscription = this.mqtt.getMessageList().subscribe(list=>{
      this.badgeNum = list.length;
    })
  }

}
