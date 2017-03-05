import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { RezeptePage } from '../pages/rezepte/rezepte';
import { FavoritenPage } from '../pages/favoriten/favoriten';
import { VorraetePage } from '../pages/vorraete/vorraete';
import { EinkaufslistePage } from '../pages/einkaufsliste/einkaufsliste';
import { FoodDetailPage } from '../pages/food-detail/food-detail';
import { ProfilePage } from '../pages/profile/profile';
import {SwiperPage} from '../pages/swiper/swiper'
import{ FavoriteProvider } from '../providers/favorite-provider';
import {SettingsPage } from '../pages/settings/settings';


import { TabsPage } from '../pages/tabs/tabs';
import { SwingModule } from 'angular2-swing';

@NgModule({
  declarations: [
    MyApp,
    RezeptePage,
    FavoritenPage,
    VorraetePage,
    EinkaufslistePage,
    FoodDetailPage,
    TabsPage,
    ProfilePage,
    SwiperPage,
    SettingsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    SwingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RezeptePage,
    FavoritenPage,
    VorraetePage,
    EinkaufslistePage,
    FoodDetailPage,
    TabsPage,
    ProfilePage,
    SwiperPage,
    SettingsPage
  ],
  providers: [FavoriteProvider,{provide: ErrorHandler, useClass: IonicErrorHandler}],

})
export class AppModule {}
