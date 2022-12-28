import { Component, ComponentFactoryResolver, ComponentRef, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isDefined } from '@app/utils/utilities';

export interface DialogComponentData {
  config?: { [key: string]: any };
  inputData?: { [key: string]: any };
  outputData?: { [key: string]: any };
  component: any;
}

@Component({
  selector: 'dynamic-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @ViewChild('target', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;

  componentRef: ComponentRef<any>;
  enableCloseButton: boolean = true;
  enableCloseFromChild: boolean = false;
  returnData: any = {};
  showTitle: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    private componentFactoryResolver: ComponentFactoryResolver,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (data.config) {
      if (isDefined(data.config['enableCloseButton'])) {
        this.enableCloseButton = data.config['enableCloseButton'];
      }
      if (isDefined(data.config['showTitle'])) {
        this.showTitle = data.config['showTitle'];
      }
    }
  }

  ngOnInit() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(this.data.component);
    this.componentRef = this.viewContainerRef.createComponent(factory);
    //inputs
    //cmpRef.instance.var1 = someValue;
    this.data.inputData = this.data.inputData ? this.data.inputData : {};
    this.data.outputData = this.data.outputData ? this.data.outputData : {};
    this.data.inputData['isDialog'] = true;
    this.bindInputData(this.data.inputData);
    this.bindOutputData(this.data.outputData);
  }

  bindInputData(inputData: { [key: string]: any }) {
    for (let [key, value] of Object.entries(inputData)) {
      this.componentRef.instance[key] = value;
    }
  }

  bindOutputData(outputData: { [key: string]: any }) {
    for (let [key, value] of Object.entries(outputData)) {
      if (value && typeof value === 'function') {
        this.componentRef.instance[key] && this.componentRef.instance[key].subscribe((data) => value(data));
      } else {
        this.componentRef.instance[key] && this.componentRef.instance[key].subscribe((data) => this.defaultOutputEventHandler(data));
      }
    }

    // dialog output handlers
    this.componentRef.instance['enableCloseButton'] &&
      this.componentRef.instance['enableCloseButton'].subscribe((data) => (this.enableCloseFromChild = data));
    this.componentRef.instance['returnData'] && this.componentRef.instance['returnData'].subscribe((data) => (this.returnData = data));
    this.componentRef.instance['closeDialog'] && this.componentRef.instance['closeDialog'].subscribe((data) => {
      this.returnData = data;
      this.closeDialog();
    });
  }

  defaultOutputEventHandler(data) {
    //this.returnData = data;
  }

  //   afterCloseReturnData(data){
  //    this.returnData = data;
  //   }

  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close(this.returnData);
    }
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
