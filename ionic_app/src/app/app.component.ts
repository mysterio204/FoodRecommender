import { Component } from '@angular/core';
import { Platform , ModalController} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import {ProfilePage} from "../pages/profile/profile";
import {SwiperPage} from '../pages/swiper/swiper'
import { SwingModule } from 'angular2-swing';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;


  constructor(platform: Platform, public modalCtrl:ModalController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    this.presentModal();

    });
  }
  presentModal() {
    let modal = this.modalCtrl.create(SwiperPage);
    modal.present();
  }
}
