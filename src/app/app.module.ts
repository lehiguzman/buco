import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

// Main application component
import { BucoApp } from './app.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';

// Navites
import { Base64 } from '@ionic-native/base64';
import { Camera } from "@ionic-native/camera";
import { CardIO } from '@ionic-native/card-io';
import { Downloader } from '@ionic-native/downloader';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Geolocation } from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';
import { LaunchNavigator } from "@ionic-native/launch-navigator";
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { NativeStorage } from '@ionic-native/native-storage';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Vibration } from '@ionic-native/vibration';

// Firebase Angular
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { firebaseConfig, environment } from '../environments/environment';

// Filtros
import { PipesModule } from './pipes/pipes.module';

// Modals
import { PushNotificationsPageModule } from "./modals/push-notifications/push-notifications.module";

// Servicios
import { AuthFirebaseService } from './providers';

import { StarRatingModule } from 'ionic4-star-rating';

@NgModule({
  declarations: [BucoApp],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      // https://ionicframework.com/docs/building/storage
      name: '__BucoApp',
      driverOrder: ["sqlite", "indexeddb", "websql", "localstorage"],
    }),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    ComponentsModule,
    HttpClientModule,
    PipesModule,
    PushNotificationsPageModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  exports: [FormsModule],
  providers: [
    // Natives
    Base64,
    Camera,
    CardIO,
    Downloader,
    FCM,
    File,
    FilePath,
    Geolocation,
    Keyboard,
    LaunchNavigator,
    NativePageTransitions,
    NativeStorage,
    Network,
    SplashScreen,
    StarRatingModule,
    StatusBar,
    Vibration,

    // Services
    AuthFirebaseService,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [BucoApp]
})
export class AppModule { }
