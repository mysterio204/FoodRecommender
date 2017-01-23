import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

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
  recipe:any;
  ingredients:any;

  constructor(public navCtrl:NavController, public navParams:NavParams) {
    this.recipe = navParams.get("recipe");
    this.ingredients = [];
    this.getIngredients();
    console.log(this.ingredients);
  }

  getIngredients() {
    let all = this.recipe.ingredients.split("\n");

    for (let i of all) {
      if (i.includes(":")) {
        i = i.split(":");
      }else{
        i = i.split("-")[0];
      }
      this.ingredients.push(i);
    }

  }

  ionViewDidLoad() {
    console.log('Hello FoodDetailPage Page');
  }

  isIngredient(ingr) {
    if (typeof(ingr) === "string") {
      return false;
    } else {
      return true;
    }
  }

  addToFavorites(){
    console.log("added to favs");
  }

  cook(){
    console.log("cook");
  }

}
