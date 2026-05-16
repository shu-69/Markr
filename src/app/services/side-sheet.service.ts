import { Injectable, signal, Type } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideSheetService {
  isOpen = signal(false);
  component = signal<Type<any> | null>(null);
  title = signal('');

  open(component: Type<any>, title: string) {
    this.component.set(component);
    this.title.set(title);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    // Delay clearing component to allow animation to finish
    setTimeout(() => {
      if (!this.isOpen()) {
        this.component.set(null);
      }
    }, 300);
  }
}
