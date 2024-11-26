import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TypewriteService {

  constructor() { }

  private typingSpeed = 20; // milisegundos entre caracteres

  typeText(text: string): Observable<string> {
    const typedText = new BehaviorSubject<string>('');

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        typedText.next(typedText.value + text[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, this.typingSpeed);

    return typedText.asObservable();
  }
}
