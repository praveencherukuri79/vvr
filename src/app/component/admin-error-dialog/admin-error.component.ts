import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-error',
  templateUrl: './admin-error.component.html',
  styleUrls: ['./admin-error.component.scss']
})
export class AdminErrorComponent {

  showLoginError: boolean;
  showRoleError: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AdminErrorComponent>){
      this.showLoginError = data['showLoginError'];
      this.showRoleError = data['showRoleError'];
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
