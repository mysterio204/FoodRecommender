import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { FoodDetailPage } from '../food-detail/food-detail';


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
item:any;
numberlist:Array<any>;
  constructor(public navCtrl: NavController, public navParams:NavParams) {

    this.item={name:"First Food",randomNumer:"555",stars:"4"};
    this.numberlist=[];
let numbers = [1,2,3,4,5,6,7,8];
    for(let n of numbers){
      this.numberlist.push(n);
    }
  }

  ionViewDidLoad() {
    console.log('Hello RezeptePage Page');
  }
  openPage(event, item,numberlist) {
   this.navCtrl.push(FoodDetailPage, {
     item: this.item,
     numberlist:this.numberlist
   });
}

}
