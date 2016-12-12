import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello VorraetePage Page');
  }

}
