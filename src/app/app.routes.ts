import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('./modal-wrapper/modal-wrapper.component').then(
        (m) => m.ModalWrapperComponent,
      ),
  },
];
