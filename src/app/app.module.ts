import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { RezeptePage } from '../pages/rezepte/rezepte';
import { FavoritenPage } from '../pages/favoriten/favoriten';
import { VorraetePage } from '../pages/vorraete/vorraete';
import { EinkaufslistePage } from '../pages/einkaufsliste/einkaufsliste';
import { TabsPage } from '../pages/tabs/tabs';

@NgModule({
  declarations: [
    MyApp,
    RezeptePage,
    FavoritenPage,
    VorraetePage,
    EinkaufslistePage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RezeptePage,
    FavoritenPage,
    VorraetePage,
    EinkaufslistePage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}