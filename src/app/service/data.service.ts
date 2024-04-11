import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  data = signal<string | null>(null);
}
