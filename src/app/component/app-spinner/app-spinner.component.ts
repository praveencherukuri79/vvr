import { Component } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-app-spinner',
  templateUrl: './app-spinner.component.html',
  styleUrls: ['./app-spinner.component.scss']
})
export class AppSpinnerComponent {
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
}
