import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import {SettingsPage} from '../settings/settings';

/*
  Generated class for the Vorraete page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-vorraete',
  templateUrl: 'vorraete.html'
})
export class VorraetePage {

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {}

  ionViewDidLoad() {
    console.log('Hello VorraetePage Page');
  }


  toSettings(){
    let modal = this.modalCtrl.create(SettingsPage);
    modal.present();
  }

}
