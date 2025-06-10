import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar, IonButton } from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';
import { ToastController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar, IonButton]
})
export class MapComponent  implements OnInit, AfterViewInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  @ViewChild('search', { static: false }) searchBar!: IonSearchbar;

  map: any;
  directionsService: any;
  directionsRenderer: any;
  currentLocation: any;
  destinationMarker: any;

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {}

   async ngAfterViewInit() {
    await this.loadMap();
  }

  async loadMap() {
   // Get current location
    const coordinates = await Geolocation.getCurrentPosition();
    this.currentLocation = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };

    // Initialize map
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: this.currentLocation,
      zoom: 14
    });

    // Place marker at current location
    new google.maps.Marker({
      position: this.currentLocation,
      map: this.map,
      title: 'You are here'
    });

    // Setup Directions Service and Renderer
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);

    // Listen for map clicks to select destination
    this.map.addListener('click', (event: any) => {
      const destination = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };

      this.getDirections(this.currentLocation, destination);
    });

    this.initAutoComplete();
  }

  initAutoComplete() {
    const input = document.querySelector('ion-searchbar input') as HTMLInputElement;

    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', this.map);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        console.error('Place has no geometry');
        return;
      }

      const destination = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      this.getDirections(this.currentLocation, destination);
    });
  }

  getDirections(origin: any, destination: any) {
    const request = {
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING'
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
        if (this.destinationMarker) {
          this.destinationMarker.setMap(null);
        }
        this.destinationMarker = new google.maps.Marker({
          position: destination,
          map: this.map,
          title: 'Destination'
        });
      } else {
        console.error('Directions request failed:', status);
      }
    });
  }

    clearRoute() {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] });
    }
    if (this.destinationMarker) {
      this.destinationMarker.setMap(null);
      this.destinationMarker = null;
    }
    this.map.setCenter(this.currentLocation);
    this.map.setZoom(12);
  }

  async saveRoute() {
  if (!this.currentLocation || !this.destinationMarker) {
    const toast = await this.toastController.create({
          message: 'No hay ruta para guardar',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
    return;
  }

  const routeData = {
    origin: this.currentLocation,
    destination: {
      lat: this.destinationMarker.getPosition().lat(),
      lng: this.destinationMarker.getPosition().lng()
    }
  };
  const navigationExtras: NavigationExtras = {
    state: {
      routeData: JSON.stringify(routeData)
    }
  };
  this.navCtrl.navigateForward('/users', navigationExtras);
  }
}
