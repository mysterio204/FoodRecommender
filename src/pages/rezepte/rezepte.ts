import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Rezepte page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-rezepte',
  templateUrl: 'rezepte.html'
})
export class RezeptePage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello RezeptePage Page');
  }

}
