import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'battery-status',
        loadChildren: ()=>import('../battery-status/battery-status.module').then(m=>m.BatteryStatusPageModule)
      },
      {
        path: 'senior-status',
        loadChildren: ()=>import('../senior-status/senior-status.module').then(m=>m.SeniorStatusPageModule)
      },
      {
        path: 'mqtt-broker',
        loadChildren: ()=>import('../mqtt-broker/mqtt-broker.module').then(m=>m.MqttBrokerPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/senior-status',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule { }
