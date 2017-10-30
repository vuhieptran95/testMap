import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as GeoFire from "geofire";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // hits: any[] = [
  //   {
  //     location: [40.93011520598305,-74.17144775390625],
  //   },
  //   {
  //     location: [40.85121557428245,-74.57244873046875]
  //   }
  // ];

  hits: any[] = [];
  dbRef: any;
  geoFire: any;
  center = [40.93011520598305,-74.17144775390625]
  // dbRef: AngularFireList<{}>;

  map: GoogleMap;
  mapElement: HTMLElement;
  constructor(
    private googleMaps: GoogleMaps,
    public platform: Platform,
    private db: AngularFireDatabase) {
    
    this.dbRef = this.db.database.ref('/location');
    this.geoFire = new GeoFire(this.dbRef);
    // this.setLocation("PHp5Elm15nhAG44f61XcTx4JQ4z2", [40.68896903762435,-73.64959716796875]);
    

    platform.ready().then(
      ()=>{
        this.getLocation(200, [40.93011520598305,-74.17144775390625]);
        // this.loadMap();
      }
    );
   }

  setLocation(key: string, coords: Array<number>){
    this.geoFire.set(key, coords).then( _ => console.log('location updated!'))
  }

  getLocation(radius: number, coords: Array<number>){
    this.geoFire.query({
      center: coords,
      radius: radius
    })
    .on('key_entered', (key, location, distance)=>{
      let hit = {
        location: location,
        distance: distance
      }

      this.hits.push(hit);
      this.loadMap();
    })
  }

  ionViewDidLoad() {
    // this.db.object('test').update({
    //   test: "a test"
    // })
  }

  loadMap() {
    this.mapElement = document.getElementById('map');

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 40.93011520598305,
          lng: -74.17144775390625
        },
        zoom: 8,
        tilt: 30
      }
    };

    this.map = this.googleMaps.create(this.mapElement, mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.

        // this.map.addMarker({
        //   title: 'Ionic',
        //   icon: 'blue',
        //   animation: 'DROP',
        //   position: {
        //     lat: this.center[0],
        //     lng: this.center[1]
        //   }
        // })

        this.hits.forEach(hit=>{
          this.map.addMarker({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: hit.location[0],
              lng: hit.location[1]
            }
          })
            .then(marker => {
              marker.on(GoogleMapsEvent.MARKER_CLICK)
                .subscribe(() => {
                  alert('clicked');
                });
            });
        })

      });
  }

}
