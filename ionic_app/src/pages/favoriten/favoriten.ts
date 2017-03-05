import { Component } from '@angular/core';
import { NavController, Tabs, ModalController} from 'ionic-angular';

import {SettingsPage} from '../settings/settings';

/*
  Generated class for the Favoriten page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-favoriten',
  templateUrl: 'favoriten.html'
})
export class FavoritenPage {

  tab:Tabs;

  constructor(public navCtrl: NavController,  public modalCtrl: ModalController) {
    this.tab = this.navCtrl.parent;
  }

  ionViewDidLoad() {
    console.log('Hello FavoritenPage Page');
  }


  toRecipes(){
    this.tab.select(0);
  }


  toSettings(){
    let modal = this.modalCtrl.create(SettingsPage);
    modal.present();
  }

}
