import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import {SettingsPage} from '../settings/settings';
/*
  Generated class for the Einkaufsliste page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-einkaufsliste',
  templateUrl: 'einkaufsliste.html'
})
export class EinkaufslistePage {

  constructor(public navCtrl: NavController,  public modalCtrl: ModalController) {}

  ionViewDidLoad() {
    console.log('Hello EinkaufslistePage Page');
  }


  toSettings(){
    let modal = this.modalCtrl.create(SettingsPage);
    modal.present();
  }

}
