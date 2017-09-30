import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Providers
import { AppConfig} from '../providers/AppConfig';

// Pages
import { SplashPage } from '../pages/splash/splash';
import { DashboardPage } from '../pages/dashboard/dashboard';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{ title: string, component: any, iconSrc: string }> = [];
  isSwipeEnable: boolean = false;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public appConfig: AppConfig,
    public menuCtrl: MenuController) {

    this.platform.ready().then(() => {
      if (this.appConfig.isRunOnMobileDevice()) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }

      if (this.appConfig.isRunOnIos()) {
        this.isSwipeEnable = true;
      }
      this.rootPage = SplashPage;
    });
    this.setMenuItems();
  }

  openPage(page) {
    this.menuCtrl.close();
    this.nav.setRoot(page.component);
  }

  setMenuItems() {
    this.pages = [];
    this.pages.push({ title: 'Dashboard', component: DashboardPage, iconSrc: 'assets/icon/menu/dashboard.png' });
  }
}
