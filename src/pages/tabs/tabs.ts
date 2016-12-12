import { Component } from '@angular/core';

import { RezeptePage } from '../rezepte/rezepte';
import { FavoritenPage } from '../favoriten/favoriten';
import { VorraetePage } from '../vorraete/vorraete';
import { EinkaufslistePage } from '../einkaufsliste/einkaufsliste';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = RezeptePage;
  tab2Root: any = FavoritenPage;
  tab3Root: any = VorraetePage;
  tab4Root: any = EinkaufslistePage;




  constructor() {

  }
}
