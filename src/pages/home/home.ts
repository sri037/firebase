import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  ref;
  name;
  newmessage;
  messagesList;
  sender_id='srinivas';
  receiver_id='John Doe';

  constructor(public navCtrl: NavController, public alert: AlertController) {
    this.ref = firebase.database().ref('messages');
  }

  ionViewDidLoad() {
    // Presenting popup
    this.alert.create({
      title: 'Username',
      inputs: [{
        name: 'username',
        placeholder: 'username'
      }],
      buttons: [{
        text: 'Continue',
        handler: username => {
          this.name = username
        }
      }]
    }).present();

    //reading data from firebase
    this.ref.on('value', data => {
      let tmp = [];
      data.forEach(data => {
        tmp.push({
          key: data.key,
          name: data.val().sender_id,
          message: data.val().message
        })
      });
      this.messagesList = tmp;
      // console.log(this.name);
    });
  }

  send() {
    console.log(this.name.username);
    // add new data to firebase
    this.ref.push({
      sender_id: this.name.username,
      receiver_id: this.receiver_id,
      message_delete_flag_by_sender_id: 0,
      message_delete_flag_by_receiver_id: 0,
      message: this.newmessage,
      subject: 'null',
      attachment_path: 'null',
      message_status: 'sent'
    });
    this.newmessage = '';
  }

}
