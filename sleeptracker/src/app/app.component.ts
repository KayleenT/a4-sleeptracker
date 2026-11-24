import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonRouterOutlet, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, documentText } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonIcon, RouterLink, RouterLinkActive],
})
export class AppComponent {
  constructor() {
    addIcons({ home, documentText });
  }
}
