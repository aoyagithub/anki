import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import firebase from "firebase/app"
import "firebase/database";
import 'firebase/auth'
import 'firebase/firestore'

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "AIzaSyC_RNKxp9WLHu2_58prw3RmyIIoqnI-Pdc",
  authDomain: "anki-2543f.firebaseapp.com",
  databaseURL: "https://anki-2543f-default-rtdb.firebaseio.com",
  projectId: "anki-2543f",
  storageBucket: "anki-2543f.appspot.com",
  messagingSenderId: "477722622928",
  appId: "1:477722622928:web:f9d321288a8abdb80fd7d5",
}
firebase.initializeApp(firebaseConfig)

// window.firebase = firebase

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app")
