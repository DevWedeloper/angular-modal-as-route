import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';

import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { ModalWrapperComponent } from './modal-wrapper.component';
import { DataService } from '../service/data.service';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';
import { Component, TemplateRef, viewChild } from '@angular/core';
import { delay, of, take } from 'rxjs';

describe('ModalWrapperComponent', () => {
  let component: ModalWrapperComponent;
  let fixture: ComponentFixture<ModalWrapperComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let dataService: DataService;
  let _hlmDialogService: HlmDialogService;

  let fixtureTemplate: ComponentFixture<WrapperComponent>;
  let componentTemplate: WrapperComponent;
  let template: TemplateRef<HTMLElement>;

  @Component({
    template: ` <ng-template #template>Something here</ng-template> `,
  })
  class WrapperComponent {
    template = viewChild.required<TemplateRef<HTMLElement>>('template');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalWrapperComponent],
      providers: [provideRouter(routes)],
      declarations: [WrapperComponent],
    }).compileComponents();

    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    dataService = TestBed.inject(DataService);
    _hlmDialogService = TestBed.inject(HlmDialogService);

    fixture = TestBed.createComponent(ModalWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    fixtureTemplate = TestBed.createComponent(WrapperComponent);
    componentTemplate = fixtureTemplate.componentInstance;
    template = componentTemplate.template();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog after route.params emits', () => {
    const spyOpen = spyOn(_hlmDialogService, 'open');

    route.params.subscribe(() => {
      _hlmDialogService.open(template);
    });

    expect(spyOpen).toHaveBeenCalledTimes(1);
  });

  it('should navigate back after dialog closed', fakeAsync(() => {
    const spyNavigate = spyOn(router, 'navigate');

    const dialogRef = _hlmDialogService.open(template);
    dialogRef.closed$.subscribe(() => {
      router.navigate(['..'], { relativeTo: route });
    });
    dialogRef.close();
    flush();

    expect(spyNavigate).toHaveBeenCalledWith(['..'], { relativeTo: route });
  }));

  it('should set data if it is not set', fakeAsync(() => {
    expect(dataService.data()).toBeNull();

    of('async dummy data')
      .pipe(delay(1000), take(1))
      .subscribe((data) => {
        dataService.data.set(data);
      });

    tick(1000);
    expect(dataService.data()).toEqual('async dummy data');
  }));
});
