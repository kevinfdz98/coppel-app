import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndexedDbService } from '../services/indexedDb.service';
import { IonList, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  imports: [JsonPipe, IonList, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonContent]
})
export class UsersComponent  implements OnInit {
  public routeData: string = '';
  public users: any[] = [];
  constructor(
  private router: Router, 
  private db: IndexedDbService,
  public toastController: ToastController
  ) { }

  ngOnInit() {
     const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.routeData = nav.extras.state['routeData'];
    }
    try {
      this.db.getAllUsers().then(users => {
        if (users.length !== 0) {
          this.users = users;
        }
      })
    } catch (error) {
      console.error('Error initializing users:', error);
    }
  }

 selectUser(user: string) {
  debugger;
    if (this.routeData) {
      this.db.loadRouteInUser(user, this.routeData).then(async (response) => {
         const toast = await this.toastController.create({
          message: 'Ruta cargada correctamente en el usuario.',
          position: 'top',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.router.navigate(['/home']);
      }).catch(error => {
        console.error('Error loading route in user:', error);
      });
    } else {
      this.db.getUserByEmail(user).then(async (userData) => {
      console.log('User data:', userData);
    })
  }
 }
}