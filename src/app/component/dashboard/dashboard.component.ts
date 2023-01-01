import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { IMstc } from '@app/interface/mstc';
import { Mstc } from '@app/model/mstc';
import { MstcService } from '@app/service/mstc-service/mstc.service';
import { SpinnerService } from '@app/service/spinner.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  selectedFileName: string;
  reportList: Array<string>;
  mstcArray: Mstc[] = [];
  mstcArrayVVRProducts: Mstc[] = [];
  mstcArrayVVRProductsGroup: Mstc[] = [];

  selectedTableType: string = 'product';

  //showSpinner: boolean = false;

  mergeColumns: Array<keyof Mstc> = [
    'QTY_OPENING_CASES',
    'QTY_OPENING_UNITS',
    'QTY_RECEIVED_CASES',
    'QTY_RECEIVED_UNITS',
    'QTY_SOLD_CASES',
    'QTY_SOLD_UNITS',
    'QTY_OTHER_ISS_CASES',
    'QTY_OTHER_ISS_UNITS',
    'QTY_STOCKED_CASES',
    'QTY_STOCKED_UNITS',
    'QTY_DENIED_CASES',
    'QTY_DENIED_UNITS'
  ];

  constructor(
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private mstcService: MstcService
  ) {}

  ngOnInit(): void {
    this.spinnerService.spin$.next(true);
    this.mstcService.getMstcReportNames().subscribe({
      next: (data) => {
        this.spinnerService.spin$.next(false);
        this.reportList = data;
        console.log('mongo Mstc ReportNames => ', data);
        //this.mstcService.getMstc('NOV-2022');
      },
      error: (error) => {
        this.spinnerService.spin$.next(false);
      }
    });
  }

  onSelectFile(reportName: string) {
    this.resetTableData();
    this.spinnerService.spin$.next(true);
    this.mstcService.getMstc(reportName).subscribe({
      next: (data) => {
        this.spinnerService.spin$.next(false);
        this.prepareDataSource(data.reportData);
        console.log('mongo get data => ', data);
        //this.mstcService.getMstc('NOV-2022');
      },
      error: (error) => {
        this.spinnerService.spin$.next(false);
        // error logic
      }
    });
  }

  onTableTypeChange(event: MatButtonToggleChange) {
    this.selectedTableType = event.value;
  }

  prepareDataSource(mstc) {
    if (mstc && mstc.length > 0) {
      mstc.forEach((obj: IMstc) => {
        this.mstcArray.push(new Mstc(obj));
      });
    }
    this.mstcArrayVVRProducts = this.mstcArray.filter((mstc: Mstc) => this.myProductIds.indexOf(mstc.INDEX_NUM) !== -1);

    this.mstcArrayVVRProductsGroup = this.prepareDataGroup(JSON.parse(JSON.stringify(this.mstcArrayVVRProducts)));

    console.log('mstcArray => ', this.mstcArray);
    console.log('mstcArrayVVRProducts => ', this.mstcArrayVVRProducts);
    console.log('mstcArrayVVRProductsGroup => ', this.mstcArrayVVRProductsGroup);
  }

  resetTableData() {
    this.mstcArray = [];
    this.mstcArrayVVRProducts = [];
    this.mstcArrayVVRProductsGroup = [];
    this.selectedTableType = 'product';
  }

  prepareDataGroup(data: Mstc[]): Mstc[] {
    let group: Mstc[] = [];
    data.forEach((obj: Mstc) => {
      let existingObj = group.find((item: Mstc) => item.INDEX_NUM == obj.INDEX_NUM);

      if (existingObj) {
        existingObj = this.mergeMstcObj(existingObj, obj);
      } else {
        delete obj.STACK_NUM;
        group.push(obj);
      }
    });

    return group;
  }

  mergeMstcObj(existingObj: Mstc, obj: Mstc): Mstc {
    this.mergeColumns.forEach((col: keyof Mstc) => {
      (existingObj[col] as number) = (existingObj[col] as number) + (obj[col] as number);
    });
    return existingObj;
  }

  // product ids aka index_num hard coded for now
  myProductIds = [
    1143, 1204, 1205, 2007, 2676, 7150, 8058, 8059, 8060, 8123, 8124, 8125, 8127, 8150, 8151, 8601, 8602, 8992, 9091, 9092, 9427, 9428,
    9429, 9485, 9648, 9654, 9976, 13069, 13099, 13100, 13115, 13119, 13127, 13136, 13137, 13138, 13140, 13141, 14031, 14032, 14125, 15006,
    15008, 15020, 15063, 15064, 15065, 15091, 15093, 15109, 18021, 18034, 18306, 18308, 18320, 18360, 18363, 18364, 18365, 18366, 18480,
    18492, 20915, 20916, 20917, 20940, 20941, 20963, 20964, 20981, 20982, 20992, 20994, 21057, 21058, 21076, 21077, 21091, 21098, 21125,
    21126, 21134, 21155, 21156, 21196, 21319, 21442, 21461, 21636, 21637, 21638, 21721, 24004, 24008, 24030, 24206, 24207, 26301, 26352,
    27240, 27245, 27275, 27276, 27277, 27411, 27412, 27434, 27435, 27476, 29037, 29038, 37113, 37127, 37129, 45404, 45422, 45760, 45761,
    45762, 45763, 45764, 45765, 45766, 45767, 45768, 45769, 45770, 45771, 45773, 45774, 85920, 85921, 86575, 86576, 88235, 88236, 88237,
    91314, 91402, 91501, 91526, 91527, 91528, 91531, 91532, 91551, 91708, 91709
  ];
}
