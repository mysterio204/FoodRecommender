import { Component } from '@angular/core';
import { NavController,ViewController, AlertController,ModalController } from 'ionic-angular';
import {SwiperPage} from '../swiper/swiper'
import { NativeStorage } from 'ionic-native'

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  profile:any;
  status:any;
  labels:any;




  constructor(public navCtrl: NavController, public viewCtrl: ViewController,
    public alertCtrl: AlertController,public modalCtrl:ModalController) {
    this.status = 1;
    this.profile={
      nutrition : 0,
      level:0,
      money: 0,
      time:0,
      calories:0
    };

    this.labels = {
      nutrition : ["Alles Esser", "Vegetarisch", "Vegan"],
      level : ["Anfänger", "Alltagskoch", "Chefkoch"],
      money : ["wenig" , "mittel", "viel"],
      time : ["wenig" , "mittel", "viel"],
      calories : ["wenig" , "mittel", "viel"],
    };


}

  dismiss(nutrition){
    //this.viewCtrl.dismiss();
    this.navCtrl.setRoot(SwiperPage, {"nutrition" : nutrition});
  }

  next(){
    if(this.status < 6){
      this.status+=1;
    }
  }

  previous(){
    if(this.status > 1){
      this.status-=1;
    }
  }

  submit(){

    NativeStorage.setItem('profile', {'profile' : this.profile})
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );

    this.dismiss(this.profile.nutrition);
  }

  showCancelAlert() {
    let alert = this.alertCtrl.create({
      title: 'Warning!',
      subTitle: 'Wenn du den Vorgang abbrichst, können wir dir keine persönlichen Rezeptvorschläge anbieten. Bist du sicher, dass du kein Profil erstellen möchtest?',
      buttons: [
        {
          text: 'Nein',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ja',
          handler: data => {
            this.profile = {};
            this.dismiss(-1);
          }
        }
      ]

    });
    alert.present();
  }

  cancel(){
    this.showCancelAlert();
  }

}
