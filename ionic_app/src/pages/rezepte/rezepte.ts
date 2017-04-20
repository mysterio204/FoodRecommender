import { Component } from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';
import { RecipeService } from '../../services/recipe-service';
import { FoodDetailPage } from '../food-detail/food-detail';
import {SwiperPage} from '../swiper/swiper'
import { ProfilePage } from  '../profile/profile';
import {SettingsPage} from '../settings/settings';
import { NativeStorage } from 'ionic-native';


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
  profileEmpty:boolean;
  ingrEmpty:boolean;
  dismiss:boolean;
  loading:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private recipeService: RecipeService,  public modalCtrl: ModalController) {

      /* TODO: Check if Profile or Ingredients are Empty for Alerts */
      this.profileEmpty = false;
      this.ingrEmpty = true;
      this.dismiss = false;
      this.loading = true;

      this.recipeService.getAll().subscribe(
        data => {
          this.recipesList = data;
          this.loading = false;
        },
        err => {
          console.log(err)
        },
          () => this.loading = false
      );

  }


  openPage(event, item) {

    NativeStorage.setItem('activeRecipe', item)
      .then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );

     this.navCtrl.push(FoodDetailPage, {
       recipe: item
     });
}


  notNow(){
    this.dismiss = true;
  }


  toIngre(){
    let modal = this.modalCtrl.create(SwiperPage, {nutrition: -1});
    modal.present();

  }

  toProfile(){
    let modal = this.modalCtrl.create(ProfilePage);
    modal.present();
  }


  toSettings(){
    let modal = this.modalCtrl.create(SettingsPage);
    modal.present();
  }

}
