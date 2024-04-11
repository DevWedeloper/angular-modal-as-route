import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { DataService } from './service/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HlmButtonModule, RouterLink],
  template: `
    <h1>Welcome to {{ title }}!</h1>

    <a hlmBtn routerLink="1" (click)="dataService.data.set('test')">1</a>
    <a hlmBtn routerLink="2" (click)="dataService.data.set('test')">2</a>
    <a hlmBtn routerLink="3" (click)="dataService.data.set('test')">3</a>
    <a hlmBtn routerLink="4" (click)="dataService.data.set('test')">4</a>

    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'angular-modal-as-route';

  protected readonly dataService = inject(DataService);
}
