import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import{FavoriteProvider} from '../../providers/favorite-provider'

/*
 Generated class for the FoodDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-food-detail',
  templateUrl: 'food-detail.html',
  providers: [FavoriteProvider]

})
export class FoodDetailPage {
  recipe:any;
  ingredients:any;
  details: any;

  favorites: any;

  constructor(public navCtrl:NavController, public navParams:NavParams,public favprv: FavoriteProvider) {
    this.recipe = navParams.get("recipe");
    this.ingredients = [];
    this.getIngredients();
    console.log(this.ingredients);

    this.details = this.recipe;

    //console.log(this.details);
    this.favorites = this.favprv.getFromStorage();
    console.log(this.favorites);

    this.details.favorite = false;
    if (this.favorites != [] && this.favorites != undefined) {
      for (let it of this.favorites) {
        if (it.session_ID == this.details.session_ID) {
          this.details.favorite = true;
        }
      }
    }
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
    this.favprv.getFromStorage().then(
        data => this.updateFavorites(data)
    );
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
  updateFavorites = function (data) {
    this.favorites = data;
    console.log("This is in Storage: " + JSON.stringify(this.favorites));
    this.details.favorite = false;
    if (this.favorites != [] && this.favorites != undefined) {
      for (let it of this.favorites) {
        if (it.session_ID == this.details.session_ID) {
          this.details.favorite = true;
        }
      }


    }


  }
  toggleFavorites(item) {
    console.log("TOGGLE");
    //this.favorites=this.favprv.getFavorites();

    if (!item.favorite) {
      console.log("Adding this item to favorites: " + JSON.stringify(item));

      let isFavorit = false;
      if (this.favorites != null) {
        console.log(this.favorites);
        for (let it of this.favorites) {
          if (it.session_ID == item.session_ID) {
            item.favorite = true;
            isFavorit = true;
            break;

          }
        }

      }
      else {
        this.favorites = [];
      }


      if (!isFavorit) {
        console.log("Current Favorites: " + JSON.stringify(this.favorites));
        item.favorite = !item.favorite;
        ;this.favorites.push(item)
        console.log("New Favorites: " + JSON.stringify(this.favorites));
        //this.setDataInStorage();
        // console.log("Storage: "+ JSON.stringify(this.getDataFromStorage()));
        this.favprv.setFavorites(this.favorites);
      }

    } else {
      item.favorite = !item.favorite;
      this.favorites = this.favorites.filter(function (obj) {
        return obj.session_ID != item.session_ID;
      });
      // this.setDataInStorage();
      this.favprv.setFavorites(this.favorites);

    }


    console.log("this should appear first");
    setTimeout(() => {
      console.log("go");

      this.favorites = this.favprv.getFromStorage();
    }, 3000);


  }
/*
  openPage(event, item) {
      this.navCtrl.push(CookingModePage, {
          recipe: item
      });
  }
*/
}
