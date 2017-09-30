import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../providers/AppConfig';
import { DashboardService } from '../../providers/dashboard/dashboard-service';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})


export class DashboardPage {
  public mRefresher: any;
  public mInfiniteScroll: any;

  public apiResult: any;
  public mImageListData: any = [];

  public view: string = "grid";
  public rows: any = [];
  public totalLength = 100;
  public page: number = 1;

  public mSelectedImageListId: any = [];

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public photoViewer: PhotoViewer,
    public dashboardService: DashboardService,
    public actionCtrl: ActionSheetController) {
  }

  ionViewDidEnter() {
    this.refreshData();
    this.getImageData(true);
  }

  ionViewWillLeave() {

  }

  changeView(view) {
    this.view = view;
  }

  doRefresh(refresher) {
    if (refresher != null) {
      this.mRefresher = refresher;
    }

    this.refreshData();
    this.getImageData(true);
  }

  refreshData() {
    this.mImageListData = [];
    this.page = 1;
    if (this.mInfiniteScroll != null) {
      this.mInfiniteScroll.enable(true);
    }
  }

  loadMoreData(infiniteScroll) {
    if (infiniteScroll != null) {
      this.mInfiniteScroll = infiniteScroll;
    }

    // console.log("Total Data : " + this.total_items);
    // console.log("Product Data : " + this.mClientList.length);

    if (this.mImageListData.length < this.totalLength) {
      this.page++;
      this.getImageData(false);
    } else {
      this.mInfiniteScroll.complete();
      this.mInfiniteScroll.enable(false);

      this.appConfig.showToast(this.appMsgConfig.NoMoreDataMsg, "bottom", 3000, true, "Ok", true);
    }
  }


  getImageData(showLoader) {
    if (this.mRefresher != null) {
      this.mRefresher.complete();
    }

    if (this.appConfig.hasConnection()) {
      if (showLoader) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
      }

      this.dashboardService.getImageData("", this.page).then(data => {
        if (this.mInfiniteScroll != null) {
          this.mInfiniteScroll.complete();
        }

        if (data != null) {
          this.appConfig.hideLoading();
          this.apiResult = data;

          if (this.apiResult != null) {
            this.setImageData(this.apiResult.results);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
            }
          }
        } else {
          this.appConfig.hideLoading();
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      }, error => {
        this.appConfig.hideLoading();
        this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setImageData(data) {
    if (data != null && Object.keys(data).length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].picture != null && data[i].picture.medium != null) {
          this.mImageListData.push({
            "link": data[i].picture.medium,
            "id": data[i].email,
            "isSelected": false,
            "large": data[i].picture.large
          });
        }
      }
      this.rows = Array.from(Array(Math.ceil(this.mImageListData.length / 2)).keys());
    }
    console.log(this.mImageListData);
    //this.manageHideShowBtn();
  }

  openImageView(item) {
    if (item.link != null && item.link != "") {
      if (item.large != null && item.large != "") {
        this.photoViewer.show(item.large);
      } else {
        this.photoViewer.show(item.link);
      }
    }
  }

  longPress(image, i) {
    let index = i;
    if (this.view == 'grid') {
      index = this.mImageListData.findIndex(img => img.id === i);
    }
    if (this.mImageListData[index] != null) {
      if (this.mSelectedImageListId.indexOf(image.id) > -1) {
        this.mSelectedImageListId.splice(this.mSelectedImageListId.indexOf(image.id), 1);
        this.mImageListData[index].isSelected = false;
      } else {
        this.mSelectedImageListId.push(image.id);
        this.mImageListData[index].isSelected = true;
      }
    }
  }

  presentActionSheet() {
    let actionSheet = this.actionCtrl.create({
      title: 'Menu',
      buttons: [
        {
          text: 'Show Selected Id',
          handler: () => {
            setTimeout(() =>{
                this.appConfig.showAlertMsg("Ids",this.mSelectedImageListId.join());
            },500);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }
}
