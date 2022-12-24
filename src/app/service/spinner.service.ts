import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { AppSpinnerComponent } from '../component/app-spinner/app-spinner.component';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private spinnerTopRef: OverlayRef = this.cdkSpinnerCreate();

  spin$: Subject<boolean> = new Subject();

  constructor(private overlay: Overlay) {
    this.spin$.asObservable().subscribe((res: boolean) => {
      if (res) {
        this.spinnerTopRef.hasAttached() ? null : this.showSpinner();
      } else {
        this.spinnerTopRef.hasAttached() ? this.stopSpinner() : null;
      }
    });
    this.spinnerTopRef.backdropClick().subscribe((e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  private cdkSpinnerCreate(): OverlayRef {
    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
    });
  }

  private showSpinner() {
    this.spinnerTopRef.attach(new ComponentPortal(AppSpinnerComponent));
    console.log('spinner attached');
  }

  private stopSpinner() {
    this.spinnerTopRef.detach();
    console.log('spinner detached');
  }
}
