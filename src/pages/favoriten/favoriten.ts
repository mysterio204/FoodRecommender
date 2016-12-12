import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello FavoritenPage Page');
  }

}
