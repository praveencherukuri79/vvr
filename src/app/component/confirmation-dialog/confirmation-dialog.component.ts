import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  heading: string;
  content: string;
  continueLabel: string;
  closeLabel: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<ConfirmationDialogComponent>) {
    this.heading = data['heading'];
    this.content = data['content'];
    this.closeLabel = data['closeLabel'];
    this.continueLabel = data['continueLabel'];
  }

  close(val: boolean): void {
    this.dialogRef.close(val);
  }
}
