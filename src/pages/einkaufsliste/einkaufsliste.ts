import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello EinkaufslistePage Page');
  }

}
