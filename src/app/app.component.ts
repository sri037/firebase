import {Component, ViewChild} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import {Push, PushObject, PushOptions} from '@ionic-native/push';
import {HomePage} from '../pages/home/home';
import {AlertController, Nav} from 'ionic-angular';
import {DetailsPage} from '../pages/details/details';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  constructor(public platform: Platform,
              public  statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public alertCtrl: AlertController,
              public push: Push) {
    this.rootPage = HomePage
    let config = {
      apiKey: "AIzaSyDIg7hgvrhp1OXAQHouXHXk37CJTTX5Amw",
      authDomain: "hooof-ionic.firebaseapp.com",
      databaseURL: "https://hooof-ionic.firebaseio.com",
      projectId: "hooof-ionic",
      storageBucket: "hooof-ionic.appspot.com",
      messagingSenderId: "1063414431124"
    };
    firebase.initializeApp(config);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.initPushNotification();
    });
  }


  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    const options: PushOptions = {
      android: {},
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token -> ' + data.registrationId);
      //TODO - send device token to server
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message -> ' + data.message);
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
              this.nav.push(DetailsPage, {message: data.message});
            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        this.nav.push(DetailsPage, {message: data.message});
        console.log('Push notification clicked');
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }
}

