import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as GeoFire from "geofire";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

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

  hits = new BehaviorSubject([]);
  dbRef: any;
  geoFire: any;
  center = [40.93011520598305,-74.17144775390625];
  markers: any[] = [];
  // dbRef: AngularFireList<{}>;

  map: GoogleMap;
  mapElement: HTMLElement;
  constructor(
    private googleMaps: GoogleMaps,
    public platform: Platform,
    private db: AngularFireDatabase) {
    
    this.dbRef = this.db.database.ref('/location');
    this.geoFire = new GeoFire(this.dbRef);
    
    

    platform.ready().then(
      ()=>{
        this.loadMap();
        setTimeout(()=>{
          this.getLocation(1500, [40.93011520598305,-74.17144775390625]);
        }, 3000)
        
      }
    );
   }

   ngOnInit(){
    this.hits.subscribe(hits => this.markers = hits)
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

      let currentHits = this.hits.value;
      currentHits.push(hit);

      this.hits.next(currentHits);
      // this.loadMap();
    })
    this.geoFire.query({
      center: coords,
      radius: radius
    }).on('key_moved', (key, location, distance)=>{
      let hit = {
        location: location,
        distance: distance
      }

      let currentHits = this.hits.value;
      currentHits.push(hit);

      this.hits.next(currentHits);
      // this.loadMap();
    })
  }

  addNewLocation(){
    this.setLocation("9hfDfQDKDbdhnOB6FAYcDy4wy0f2", [40.68792771802359,-74.47837829589844]);
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

    
      this.hits.subscribe(hits=>{
        this.map.clear().then(_=>{
          hits.forEach(hit=>{
            this.map.addMarker({
              title: 'Ionic',
              icon: 'blue',
              // animation: 'DROP',
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
        
      })
    
    // Wait the MAP_READY before using any methods.
    // this.map.one(GoogleMapsEvent.MAP_READY)
    //   .then(() => {
    //     console.log('Map is ready!');
    //     this.hits.subscribe(hits=>{
    //       hits.forEach(hit=>{
    //         this.map.addMarker({
    //           title: 'Ionic',
    //           icon: 'blue',
    //           animation: 'DROP',
    //           position: {
    //             lat: hit.location[0],
    //             lng: hit.location[1]
    //           }
    //         })
    //           .then(marker => {
    //             marker.on(GoogleMapsEvent.MARKER_CLICK)
    //               .subscribe(() => {
    //                 alert('clicked');
    //               });
    //           });
    //       })
    //     })

    //   });
  }

}
