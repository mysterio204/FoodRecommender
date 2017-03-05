import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public modalCtrl:ModalController) {

  }

  ionViewDidLoad() {
    console.log('Hello SettingsPage Page');
  }

  dismiss(){
    this.navCtrl.setRoot(TabsPage);
  }

}
