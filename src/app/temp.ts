// <div class="example-container mat-elevation-z8" [class.hidden]="!dataSource" *ngIf="tableDisplay">

//     <mat-form-field>
//         <mat-label>Filter by Index Number</mat-label>
//         <input matInput (keyup)="applyFilterIndexNum($event)" placeholder="Index Number" #input>
//       </mat-form-field>

//       <mat-form-field>
//         <mat-label>Filter by Name</mat-label>
//         <input matInput (keyup)="applyFilterName($event)" placeholder="Name" #input>
//       </mat-form-field>

//     <!-- <mat-table #table [dataSource]="dataSource" matSort> -->
//     <mat-table #table [dataSource]="dataSource" matSort matSortDirection="asc" matSortActive="indexNumber"
//         matSortDisableClear>

//         <!-- name -->
//         <ng-container matColumnDef="name">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="NAME"> Name </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Name:</span> {{element.NAME}} </mat-cell>
//             <mat-footer-cell *matFooterCellDef>Total</mat-footer-cell>
//         </ng-container>

//         <!-- year-month -->
//         <ng-container matColumnDef="year-month">
//             <mat-header-cell *matHeaderCellDef> year Month </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">year Month:</span> {{element.YEAR_MONTH}}
//             </mat-cell>
//             <mat-footer-cell *matFooterCellDef></mat-footer-cell>
//         </ng-container>

//         <!-- groupCode -->
//         <ng-container matColumnDef="groupCode">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="GROUP_CODE"> Group Code </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Group Code:</span> {{element.GROUP_CODE}}
//             </mat-cell>
//             <mat-footer-cell *matFooterCellDef></mat-footer-cell>
//         </ng-container>

//         <!-- indexNumber -->
//         <ng-container matColumnDef="indexNumber">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="INDEX_NUM"> Index Number </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Index Number:</span> {{element.INDEX_NUM}}
//             </mat-cell>
//             <mat-footer-cell *matFooterCellDef></mat-footer-cell>
//         </ng-container>

//         <!-- itemDesc -->
//         <ng-container matColumnDef="itemDesc">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="ITEM_DESC"> Item Desc </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Item Desc:</span> {{element.ITEM_DESC}}
//             </mat-cell>
//             <mat-footer-cell *matFooterCellDef></mat-footer-cell>
//         </ng-container>

//         <!-- stackNumber -->
//         <ng-container matColumnDef="stackNumber">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="STACK_NUM"> Stack No. </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Stack No.:</span> {{element.STACK_NUM}}
//             </mat-cell>
//             <mat-footer-cell *matFooterCellDef></mat-footer-cell>
//         </ng-container>

//         <!-- casePack -->
//         <ng-container matColumnDef="casePack">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="CASE_PACK"> Case Pack </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Case Pack:</span> {{element.CASE_PACK}}
//             </mat-cell>
//             <mat-footer-cell *matFooterCellDef></mat-footer-cell>
//         </ng-container>

//         <!-- openingCases -->
//         <ng-container matColumnDef="openingCases">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="QTY_OPENING_CASES"> Opening Cases</mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Opening Cases:</span>
//                 {{element.QTY_OPENING_CASES}} </mat-cell>
//             <mat-footer-cell *matFooterCellDef> {{getTotal('QTY_OPENING_CASES')}} </mat-footer-cell>
//         </ng-container>

//         <!-- openingUnits -->
//         <ng-container matColumnDef="openingUnits">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="QTY_OPENING_UNITS"> Opening Units </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Opening Units:</span>
//                 {{element.QTY_OPENING_UNITS}} </mat-cell>
//             <mat-footer-cell *matFooterCellDef> {{getTotal('QTY_OPENING_UNITS')}} </mat-footer-cell>
//         </ng-container>

//         <!-- receivedCases -->
//         <ng-container matColumnDef="receivedCases">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="QTY_RECEIVED_CASES"> Received Cases </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Received Cases:</span>
//                 {{element.QTY_RECEIVED_CASES}} </mat-cell>
//             <mat-footer-cell *matFooterCellDef> {{getTotal('QTY_RECEIVED_CASES')}} </mat-footer-cell>
//         </ng-container>

//         <!-- receivedUnits -->
//         <ng-container matColumnDef="receivedUnits">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="QTY_RECEIVED_UNITS"> Received Units </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Received Units:</span>
//                 {{element.QTY_RECEIVED_UNITS}} </mat-cell>
//             <mat-footer-cell *matFooterCellDef> {{getTotal('QTY_RECEIVED_UNITS')}} </mat-footer-cell>
//         </ng-container>

//         <!-- soldCases -->
//         <ng-container matColumnDef="soldCases">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="QTY_SOLD_CASES"> Sold Cases </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Sold Cases:</span> {{element.QTY_SOLD_CASES}}
//             </mat-cell>
//             <mat-footer-cell *matFooterCellDef> {{getTotal('QTY_SOLD_CASES')}} </mat-footer-cell>
//         </ng-container>

//         <!-- soldUnits -->
//         <ng-container matColumnDef="soldUnits">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="QTY_SOLD_UNITS"> Sold Units </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Sold Units:</span> {{element.QTY_SOLD_UNITS}}
//             </mat-cell>
//             <mat-footer-cell *matFooterCellDef> {{getTotal('QTY_SOLD_UNITS')}} </mat-footer-cell>
//         </ng-container>


//         <!-- otherIssueCases -->
//         <ng-container matColumnDef="otherIssueCases">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="QTY_OTHER_ISS_CASES"> Other Issue Cases
//             </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Other Issue Cases:</span>
//                 {{element.QTY_OTHER_ISS_CASES}} </mat-cell>
//             <mat-footer-cell *matFooterCellDef> {{getTotal('QTY_OTHER_ISS_CASES')}} </mat-footer-cell>
//         </ng-container>

//         <!-- otherIssueUnits -->
//         <ng-container matColumnDef="otherIssueUnits">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="QTY_OTHER_ISS_UNITS"> Other Issue Units
//             </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Other Issue Units:</span>
//                 {{element.QTY_OTHER_ISS_UNITS}} </mat-cell>
//             <mat-footer-cell *matFooterCellDef> {{getTotal('QTY_OTHER_ISS_UNITS')}} </mat-footer-cell>
//         </ng-container>

//         <!-- stockedCases -->
//         <ng-container matColumnDef="stockedCases">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="QTY_STOCKED_CASES"> Stocked Cases (closed)
//             </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Stocked Cases (closed):</span>
//                 {{element.QTY_STOCKED_CASES}} </mat-cell>
//             <mat-footer-cell *matFooterCellDef> {{getTotal('QTY_STOCKED_CASES')}} </mat-footer-cell>
//         </ng-container>

//         <!-- stockedUnits -->
//         <ng-container matColumnDef="stockedUnits">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="QTY_STOCKED_UNITS"> Stocked Units (closed)
//             </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Stocked Units (closed):</span>
//                 {{element.QTY_STOCKED_UNITS}} </mat-cell>
//             <mat-footer-cell *matFooterCellDef> {{getTotal('QTY_STOCKED_UNITS')}} </mat-footer-cell>
//         </ng-container>

//         <!-- deniedCases -->
//         <ng-container matColumnDef="deniedCases">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="QTY_DENIED_CASES"> Denied Cases </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Denied Cases:</span>
//                 {{element.QTY_DENIED_CASES}} </mat-cell>
//             <mat-footer-cell *matFooterCellDef> {{getTotal('QTY_DENIED_CASES')}} </mat-footer-cell>
//         </ng-container>

//         <!-- deniedUnits -->
//         <ng-container matColumnDef="deniedUnits">
//             <mat-header-cell *matHeaderCellDef mat-sort-header="QTY_DENIED_UNITS"> Denied Units </mat-header-cell>
//             <mat-cell *matCellDef="let element"><span class="mobile-label">Denied Units:</span>
//                 {{element.QTY_DENIED_UNITS}} </mat-cell>
//             <mat-footer-cell *matFooterCellDef> {{getTotal('QTY_DENIED_UNITS')}} </mat-footer-cell>
//         </ng-container>

//         <mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
//         <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
//         <mat-footer-row *matFooterRowDef="displayedColumns; sticky: true"></mat-footer-row>
//         <!-- </table> -->
//     </mat-table>
// </div>








//************Print********************* */
//************Print********************* */
//************Print********************* */
//************Print********************* */












  // printWindow1() {
  //   let doc = new jsPDF();
  //   let data: Array<any> = [];

  //   this.dataSource.filteredData.forEach((obj: Mstc) => {
  //     let arr: Array<any> = [];
  //     this.displayedColumns.forEach((col) => {
  //       arr.push(obj[col]);
  //     });
  //     data.push(arr);
  //   });
  //   // autoTable({
  //   //   head: [['NAme','approved','utilised', 'available','asd','sadadasada','asdas']],
  //   //   body: data
  //   // });

  //   autoTable(doc, {
  //     head: [this.displayedColumns],
  //     body: data,
  //     didDrawPage: (dataArg) => {
  //       doc.text('PAGE', dataArg.settings.margin.left, 10);
  //     },
  //   });
  //   doc.save('table.pdf');
  // }

//   printWindow5() {
//     const printContent = document.getElementById('vvr-mat-table');
//     let printHead = document.head.innerHTML;
//     // const WindowPrt = window.open(
//     //   '',
//     //   '',
//     //   'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0'
//     // );
//     const WindowPrt = window.open(
//       '',
//       '_blank',
//       'top=0,left=0,height=auto,width=900'
//     );
//     //WindowPrt.document.write(printContent.innerHTML);
//     WindowPrt.document.write(`
//   <html>
//   ${printHead}
// <body>${printContent.innerHTML}</body>
//   </html>`);
//     WindowPrt.document.close();
//     WindowPrt.focus();
//     WindowPrt.print();
//     WindowPrt.close();
//   }

//   printWindow4() {
//     let printContents, popupWin;
//     printContents = document.getElementById('vvr-mat-table').innerHTML;
//     //console.log(printContents)
//     popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
//     popupWin.document.open();
//     popupWin.document.write(`
//   <html>
//     <head>
//       <title>Print tab</title>
     
//     </head>
// <body onload="window.print();window.close()"><table class="table table-bordered">${printContents}</table></body>
//   </html>`);
//     popupWin.document.close();
//   }