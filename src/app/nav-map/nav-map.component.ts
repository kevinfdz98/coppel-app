import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IndexedDbService } from '../services/indexedDb.service';
import { DataService } from '../services/data.service';

declare const google: any;

@Component({
  selector: 'app-nav-map',
  templateUrl: './nav-map.component.html',
  styleUrls: ['./nav-map.component.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButton]

})
export class NavMapComponent implements OnInit, AfterViewInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;

  map: any;
  directionsService: any;
  directionsRenderer: any;
  currentLocation: any;
  public routeData: any;
  public userEmail: string = '';

  constructor(
      private router: Router,
      private toastController: ToastController,
      private db: IndexedDbService,
      private dataService: DataService
  ) { }

  ngOnInit() {
      const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.routeData = nav.extras.state['routeData'];
      this.userEmail = nav.extras.state['userEmail'] || ''; 
    }
  }

  ngAfterViewInit() {
    this.initMap();
  }
    async initMap() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.currentLocation = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };

    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: this.currentLocation
    });

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);

    this.calculateAndDisplayRoute();
  }

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.currentLocation,
      destination: this.routeData.destination, // Assuming routeData contains a destination
      travelMode: google.maps.TravelMode.DRIVING
    }, (response: any, status: any) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  goToMaps(){
    const origin = `${this.currentLocation.lat},${this.currentLocation.lng}`;
    const destination = `${this.routeData.destination.lat},${this.routeData.destination.lng}`;
    const url = `google.navigation:q=${destination}&mode=d`;
    //const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_system'); // '_system' for Cordova/Ionic, or '_blank' for browser
  }

 async finalizeRoute() {
  // this.db.removeDeliveryRoute(this.userEmail).then(() => {});
  //   this.db.userOnSite(this.userEmail, true).then(async () => {
  //       const toast = await this.toastController.create({
  //         message: 'Ruta finalizada correctamente. Usuario en sitio.',
  //         position: 'top',
  //         duration: 2000,
  //         color: 'success'
  //       });
  //       await toast.present();
  //   })
  this.dataService.removeDeliveryRoute(this.userEmail);
  this.dataService.userOnSite(this.userEmail, true);
    this.router.navigate(['/home'])
  }

}
