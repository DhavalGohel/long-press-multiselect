# long-press-multiselect
This is demo project for long press multiple item select

This is application demo for Bulk action for example select multiple item and deleted ,approve,cancel all the thing are done with this repo

You only just copy some code in your project

How to use please see below
Step 1: - declare main array list you want to show
```
public mArrayList: any = [];
```
Step 2: - declare array list to stored id of selected item
```
public mSelectedImageListId: any = [];
```
Step 3: - just copy and pest it to your ts file
```
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
```
Step 4: - just copy and pest it to html file or else copy only function
```
(press)="longPress(list,j)  // where to rander your list
```

```
<ion-card padding *ngFor="let list of mArrayList; let j = index" (press)="longPress(list,j)" [ngClass]="list.isSelected ? 'grey-background' : 'white-background'">
  <img src="{{list.link}}" height="250px" />
</ion-card>
```
