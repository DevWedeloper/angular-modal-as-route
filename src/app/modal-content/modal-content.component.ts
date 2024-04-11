import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { injectBrnDialogContext } from '@spartan-ng/ui-dialog-brain';
import { hlmH1 } from '@spartan-ng/ui-typography-helm';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-modal-content',
  standalone: true,
  template: `
    <h1 class="${hlmH1}">{{ id }}</h1>
    <p>{{ dataService.data() }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex h-[400px] w-[400px] flex-col items-center justify-center',
  },
})
export class ModalContentComponent {
  private readonly _dialogContext = injectBrnDialogContext<{ id: string }>();
  protected readonly id = this._dialogContext.id;
  protected readonly dataService = inject(DataService);
}
