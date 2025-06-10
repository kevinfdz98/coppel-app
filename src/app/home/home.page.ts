
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonButton, IonIcon } from '@ionic/angular/standalone';
import { MessageComponent } from '../message/message.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, MessageComponent, IonButton, IonIcon],
})
export class HomePage {
  constructor( private router: Router ) {}

  navigateToMap(){
    this.router.navigate(['/map']);
  }

  navigateToUsers() {
    this.router.navigate(['/users']);
  }
}
