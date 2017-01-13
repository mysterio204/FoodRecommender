import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';

/*
  Generated class for the FoodDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-food-detail',
  templateUrl: 'food-detail.html',

})
export class FoodDetailPage {
item:any;

  constructor(public navCtrl: NavController,public navParams:NavParams) {
    this.item=navParams.get("item");
  }

  ionViewDidLoad() {
    console.log('Hello FoodDetailPage Page');
  }

}
