import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RecipeService } from '../../services/recipe-service';
import { FoodDetailPage } from '../food-detail/food-detail';


/*
  Generated class for the Rezepte page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-rezepte',
  templateUrl: 'rezepte.html',
  providers : [RecipeService]
})
export class RezeptePage {

  item:any;
  recipesList:Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private recipeService: RecipeService) {

      this.recipeService.getAll().subscribe(
        data => {
          this.recipesList = data;
        },
        err => {
          console.log(err)
        },
          () => console.log("Recipe Search Complete")
      );
  }

  ionViewDidLoad() {
    console.log('Hello RezeptePage Page');

  }
  openPage(event, item) {
   this.navCtrl.push(FoodDetailPage, {
     item: this.item
   });
}

}
