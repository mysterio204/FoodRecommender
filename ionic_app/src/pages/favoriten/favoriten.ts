import { Component } from '@angular/core';
import { NavController, Nav, Tabs } from 'ionic-angular';

import { RezeptePage } from '../rezepte/rezepte';

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

  constructor(public navCtrl: NavController, private nav: Nav) {
    this.tab = this.navCtrl.parent;
  }

  ionViewDidLoad() {
    console.log('Hello FavoritenPage Page');
  }


  toRecipes(){
    this.tab.select(0);
  }

}
