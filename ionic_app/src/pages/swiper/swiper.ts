import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController,ViewController, AlertController, NavParams} from 'ionic-angular';
import { Http } from '@angular/http';
import { RecipeService } from '../../services/recipe-service';
import { TabsPage } from '../tabs/tabs';
import 'rxjs/Rx';

import {
    StackConfig,
    Stack,
    Card,
    ThrowEvent,
    DragEvent,
    SwingStackComponent,
    SwingCardComponent} from 'angular2-swing';



@Component({
    selector: 'page-swiper',
    templateUrl: 'swiper.html',
    providers : [RecipeService]
})
export class SwiperPage {
    @ViewChild('myswing1') swingStack: SwingStackComponent;
    @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

    stackConfig: StackConfig;
    ingrList : Array<any>;
    likeList : Array<any>;
    dislikeList : Array<any>;
    nutrition : any;

    constructor(public navCtrl: NavController, private http: Http,public viewCtrl: ViewController,
                public recipeService : RecipeService, public alertCtrl: AlertController,
                public navParams : NavParams) {

      this.nutrition = navParams.get("nutrition");

      this.likeList = [];
      this.dislikeList = [];

      this.recipeService.getIngredients(this.nutrition).subscribe(
        data => {
          this.ingrList = data;
        },
        err => {
          console.log(err)
        },
        () => console.log(this.ingrList)
      );



      this.stackConfig = {
            throwOutConfidence: (offset, element) => {
                return Math.min(Math.abs(offset) / (element.offsetWidth/2), 1);
            },
            transform: (element, x, y, r) => {
                this.onItemMove(element, x, y, r);
            },
            throwOutDistance: (d) => {
                return 800;
            }
        };
    }

    ngAfterViewInit() {
        // Either subscribe in controller or set in HTML
        this.swingStack.throwin.subscribe((event: DragEvent) => {
            event.target.style.background = '#ffffff';
        });

    }

    // Called whenever we drag an element
    onItemMove(element, x, y, r) {
        var color = '';
        var abs = Math.abs(x);
        let min = Math.trunc(Math.min(16*16 - abs, 16*16));
        let hexCode = this.decimalToHex(min, 2);

        if (x < 0) {
            color = '#FF' + hexCode + hexCode;
        } else {
            color = '#' + hexCode + 'FF' + hexCode;
        }

        element.style.background = color;
        element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
    }

    // Connected through HTML
    voteUp(like: boolean) {
        let removedCard = this.ingrList.pop();
        if (like) {
          this.likeList.push(removedCard.Ids);
        } else {
          this.dislikeList.push(removedCard.Ids);
        }
        if(this.ingrList.length === 0){
          this.showFinishedAlert();
        }
        if(this.likeList.length === 10 || this.dislikeList.length === 10){
            this.showReadyAlert();
        }
    }


  showFinishedAlert() {
    let alert = this.alertCtrl.create({
      title: 'Vielen Dank',
      subTitle: 'Du hast genügend Zutaten bewertet. Jetzt gehts los!',
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            this.dismiss();
          }
        }
      ]

    });
    alert.present();
  }


    showReadyAlert() {
      let alert = this.alertCtrl.create({
        title: 'Das reicht erstmal!',
        subTitle: 'Du hast genügend Zutaten bewertet. Du kannst allerdings auch weiter bewerten.',
        buttons: [
          {
            text: 'Weiter',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Reicht',
            handler: data => {
              console.log(this.likeList);
              console.log(this.dislikeList);
              this.dismiss();
            }
          }
        ]

      });
      alert.present();
    }


    // http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
    decimalToHex(d, padding) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

        while (hex.length < padding) {
            hex = "0" + hex;
        }

        return hex;
    }
    dismiss(){
      this.navCtrl.setRoot(TabsPage);
    }

    skip(){
      let alert = this.alertCtrl.create({
        title: 'Warning!',
        subTitle: 'Wenn du den Vorgang abbrichst, können wir dir keine persönlichen Rezeptvorschläge anbieten. Bist du sicher, dass du keine Zutaten bewerten willst?',
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
              this.likeList = [];
              this.dislikeList = [];
              this.dismiss();
            }
          }
        ]

      });
      alert.present();
    }

    skipIngr(){
      this.ingrList.pop();
    }

}
