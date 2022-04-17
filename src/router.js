import Vue from "vue";
import Router from "vue-router";
import Flashcard from './components/Flashcard.vue'
import Add from './components/Add.vue'
import List from './components/List.vue'

Vue.use(Router);
export default new Router({
  mode: "history",
  routes: [
      {
        path: '/',            
        component: Flashcard,
        name: 'Flashcard',
      },
      {
        path: '/add',            
        component: Add,
        name: 'add',
      },
      {
        path: '/list',            
        component: List,
        name: 'list',
      },
  ]
});