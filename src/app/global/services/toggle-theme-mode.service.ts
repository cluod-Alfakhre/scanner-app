import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ToggleThemeModeService {

  private _isDarkMode: WritableSignal<boolean> = signal(false);

  isDarkMode: Signal<boolean> = computed(() => {
    return this._isDarkMode()
  })

  /*  public get isDarkMode(): boolean {
     return this._isDarkMode
   } */

  constructor() {
    this._isDarkMode.update(() => !!localStorage.getItem('darkMode'))
    this.toggleDarkMode(!this._isDarkMode()) //the _isDarkMode is converted here because this is the init time where we check if the dark mode was exist before refreshing
  }

  toggleDarkMode(isDarkMode: boolean = this._isDarkMode()) {
    if (isDarkMode) {
      this._isDarkMode.update(() => false)
      localStorage.removeItem('darkMode')
      document.body.classList.remove('dark_mode')
    }
    else {
      this._isDarkMode.update(() => true)
      localStorage.setItem('darkMode', 'true');
      document.body.classList.add('dark_mode')
    }
  }

}
