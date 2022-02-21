import * as admin from "firebase-admin";
// import configs from "./configs";
var serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-crud-d3f59.firebaseio.com",
  // storageBucket: configs.BUCKET_URL,
});

const db = admin.firestore();
// const bucket = admin.storage().bucket();

export { admin, db };
