import * as admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
// import firebaseServiceAccount from '../../config/firebase.json'; 

if (admin.apps.length === 0) {
  // let file: any = firebaseServiceAccount;
  // initializeApp({
  //   credential: admin.credential.cert(file),
  // });
}

export default admin;