import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { BehaviorSubject, filter, take } from 'rxjs';
import { DataService } from './service/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HlmButtonModule, RouterLink],
  template: `
    @if (onRefresh() && !currentActiveRoute()) {
      <h1>Welcome to {{ title }}!</h1>

      <a hlmBtn routerLink="1" (click)="dataService.data.set('test')">1</a>
      <a hlmBtn routerLink="2" (click)="dataService.data.set('test')">2</a>
      <a hlmBtn routerLink="3" (click)="dataService.data.set('test')">3</a>
      <a hlmBtn routerLink="4" (click)="dataService.data.set('test')">4</a>
    }

    <router-outlet
      (activate)="currentActiveRoute$.next(true)"
      (deactivate)="currentActiveRoute$.next(false)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'angular-modal-as-route';

  protected readonly dataService = inject(DataService);
  private router = inject(Router);
  protected onRefresh = signal(false);
  protected currentActiveRoute = signal(false);
  protected currentActiveRoute$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        take(1),
      )
      .subscribe((event) => {
        this.currentActiveRoute$.pipe().subscribe((value) => {
          this.currentActiveRoute.set(value);
          if (!value) {
            this.currentActiveRoute$.complete();
          }
        });

        if (event.id === 1) {
          this.onRefresh.set(true);
        } else {
          this.onRefresh.set(false);
        }
      });
  }
}
