import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  private currentTrolleyCount = new BehaviorSubject(0);
  currentMessage = this.currentTrolleyCount.asObservable();

  constructor() { }

   updateTrolleyCount(count: number) {
    this.currentTrolleyCount.next(count)
  }
}