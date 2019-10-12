import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MqttBrokerPage } from './mqtt-broker.page';

const routes: Routes = [
  {
    path: '',
    component: MqttBrokerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MqttBrokerPage]
})
export class MqttBrokerPageModule {}
