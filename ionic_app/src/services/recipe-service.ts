import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

export class RecipeService {
  static get parameters() {
    return [[Http]];
  }

  url : any;

  constructor(private http:Http) {
    this.url = "http://52.34.99.222:3333/api/get";
  }

  getAll() {
    var request = this.url + "/all";
    var response = this.http.get(request).map(res => res.json());
    return response;
  }

  getIngredients(ingr){
    var request = this.url + "/zutaten/" + ingr;
    var response = this.http.get(request).map(res => res.json());
    return response;
  }
}
