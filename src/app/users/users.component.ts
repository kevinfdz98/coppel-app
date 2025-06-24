import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, IonImg, IonText, IonList, IonLabel, IonItem, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar, IonIcon } from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  imports: [
    IonImg,
    IonButton, 
    IonList, 
    IonLabel,
    IonAvatar,
    IonIcon,
    IonItem, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    JsonPipe,
    IonText,
    IonContent]
})
export class UsersComponent  implements OnInit {
  public routeData: string = '';
  public users: any[] = [];
  public navOption: string = '';

  constructor(
  private router: Router, 
  private dataService: DataService,
  public toastController: ToastController
  ) { }

  ngOnInit() {
     const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      console.log('Navigation extras state:', nav.extras.state);
      this.routeData = nav.extras.state['routeData'];
      this.navOption = nav.extras.state['option'] || '';
    }
    const dataBaseUsers = this.dataService.getAllUsers();
        if (dataBaseUsers.length !== 0) {
          if(this.navOption === 'pickup') {
          this.users = dataBaseUsers.filter(user => !user.pickupRoute);
          console.log('Filtered users for pickup:', this.users);
        } else {
          this.users = dataBaseUsers.filter(user => !user.deliveryRoute );
          console.log('Filtered users for delivery:', this.users);
        }
        }
  }

 async selectUser(user: string) {
    if (this.routeData) {
      this.dataService.loadRouteInUser(user, this.routeData, this.navOption);
      const toast = await this.toastController.create({
          message: 'Ruta cargada correctamente en el usuario.',
          position: 'top',
          duration: 2000,
          color: 'success'
      });
      await toast.present();
      this.router.navigate(['/home']);
    }
 }
}