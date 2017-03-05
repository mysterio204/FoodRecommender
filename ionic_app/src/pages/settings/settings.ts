import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SwiperPage } from '../swiper/swiper';

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

    profile:any;
    labels:any;

  constructor(public navCtrl: NavController, public modalCtrl:ModalController) {

    this.profile={
      nutrition : 0,
      level:0,
      money: 0,
      time:0,
      calories:0
    };

    this.labels = {
      nutrition : ["Alles Esser", "Vegetarisch", "Vegan"],
      level : ["Anfänger", "Alltagskoch", "Chefkoch"],
      money : ["wenig" , "mittel", "viel"],
      time : ["wenig" , "mittel", "viel"],
      calories : ["wenig" , "mittel", "viel"],
    };
  }

  ionViewDidLoad() {
    console.log('Hello SettingsPage Page');
  }

  dismiss(){
    this.navCtrl.setRoot(TabsPage);
  }

  saveProfile(){

  }

  toIngredients(){
    let modal = this.modalCtrl.create(SwiperPage, {nutrition: -1});
    modal.present();
  }

}
