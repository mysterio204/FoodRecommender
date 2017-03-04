import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {NativeStorage} from 'ionic-native';
import {Platform} from 'ionic-angular';


/*
 Generated class for the FavoriteProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class FavoriteProvider {
  favorites: Array<any>;

  constructor(public http: Http, public platform: Platform) {
    this.favorites = [];

  }

  getFavorites() {
    return this.favorites;


  }

  setFavorites(favs) {
    console.log("First step in Provide: Set local variable");

    this.favorites = favs;
    console.log("done: " + this.favorites);
    this.saveToStorage();
  }

  addFavorite(item) {
    this.favorites.push(item);
  }

  removeFavorite(item) {
    this.favorites = this.favorites.filter(function (obj) {

      return obj.doc_id != item.doc_id;
    });
  }


  saveToStorage() {
    console.log("Pack this shit in storage: " + this.favorites);
    // NativeStorage.clear();

    return this.platform.ready().then((readySource) => {
      NativeStorage.setItem('favorites', this.favorites)
        .then(
          () => console.log('Stored item:' + this.favorites),
          error => console.error('Error storing item', error)
        );
    })
  }

  getFromStorage() {
    // data =>  result=data,
    //let result =[];

    return this.platform.ready().then((readySource) => {
        return NativeStorage.getItem('favorites')
          .then(data => {
              if (data != null) {
                return data
              } else {
                return []
              }


            },
            error => {
              console.log("Error getting item: " + JSON.stringify(error));
              return [];
            }
          )




      }

    );

  }

  /*   console.log("Storage: " + JSON.stringify(result));
   if (result != undefined) {
   this.favorites = result;
   return result;
   } else {
   return null;
   }

   }*/

}
