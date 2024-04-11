import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';
import { delay, of, take } from 'rxjs';
import { ModalContentComponent } from '../modal-content/modal-content.component';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-modal-wrapper',
  standalone: true,
  imports: [ModalContentComponent],
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalWrapperComponent {
  private route = signal<ActivatedRoute>(inject(ActivatedRoute));
  private router = inject(Router);
  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly dataService = inject(DataService);

  constructor() {
    this.route()
      .params.pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const dialogRef = this._hlmDialogService.open(ModalContentComponent, {
          context: { id: params['id'] },
          contentClass: 'flex',
        });

        dialogRef.closed$.pipe(takeUntilDestroyed()).subscribe(() => {
          this.router.navigate(['..'], { relativeTo: this.route() });
        });
      });

    effect(() => {
      if (!this.dataService.data()) {
        of('async dummy data')
          .pipe(delay(1000), take(1))
          .subscribe((data) => {
            this.dataService.data.set(data);
          });
      }
    });
  }
}
