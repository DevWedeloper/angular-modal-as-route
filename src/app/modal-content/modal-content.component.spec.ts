import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DIALOG_DATA } from '@angular/cdk/dialog';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DataService } from '../service/data.service';
import { ModalContentComponent } from './modal-content.component';

describe('ModalContentComponent', () => {
  let component: ModalContentComponent;
  let fixture: ComponentFixture<ModalContentComponent>;
  let debugEl: DebugElement;
  let dataService: DataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalContentComponent],
      providers: [{ provide: DIALOG_DATA, useValue: { id: '1' } }],
    }).compileComponents();

    dataService = TestBed.inject(DataService);

    fixture = TestBed.createComponent(ModalContentComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the ID in the template', () => {
    const idEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="id"]'),
    ).nativeElement;
    expect(idEl.innerText).toEqual('1');
  });

  it('should render the data in the template', () => {
    const dataEl: HTMLElement = debugEl.query(
      By.css('[data-testingId="data"]'),
    ).nativeElement;

    dataService.data.set('test');
    fixture.detectChanges();
    expect(dataEl.innerText).toEqual('test');

    dataService.data.set(null);
    fixture.detectChanges();
    expect(dataEl.innerText).toEqual('');
  });
});
