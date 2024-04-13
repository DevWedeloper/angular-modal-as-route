import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';
import { delay, filter, of, take } from 'rxjs';
import { ModalContentComponent } from '../modal-content/modal-content.component';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-modal-wrapper',
  standalone: true,
  imports: [ModalContentComponent, RouterLink],
  template: `
    @if (onRefresh()) {
      <a routerLink=".."> Back </a>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalWrapperComponent {
  private route = signal<ActivatedRoute>(inject(ActivatedRoute));
  private router = inject(Router);
  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly dataService = inject(DataService);
  protected onRefresh = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        if (event.id === 1) {
          this.onRefresh.set(true);
        } else {
          this.route().params.subscribe((params) => {
            const dialogRef = this._hlmDialogService.open(
              ModalContentComponent,
              {
                context: { id: params['id'] },
                contentClass: 'flex',
              },
            );

            dialogRef.closed$.subscribe(() => {
              this.router.navigate(['..'], { relativeTo: this.route() });
            });
          });
        }
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
