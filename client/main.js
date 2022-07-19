import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeteorTracker from 'vue-meteor-tracker';
Vue.use(VueRouter);

Vue.use(VueMeteorTracker);

import Vuetify from 'vuetify'; 
import 'vuetify/dist/vuetify.min.css';
//import VMarkdown from 'v-markdown/src';
 
//Vue.use(VMarkdown);
Vue.use(Vuetify); // this is all you need for Vuetify 1.x

import '../imports/ui/plugins'
import '/polyfills/router.js'

import Home from "/imports/ui/views/Home.vue"
import Library from "/imports/ui/views/Library.vue"
import Book from "/imports/ui/views/Book.vue"
import LoginForm from "/imports/ui/views/LoginForm.vue";
import Pinboard from "/imports/ui/views/Pinboard.vue"
import Settings from "/imports/ui/views/Settings.vue";

const routes = [
  { path: '/', component: Home },
  { path: '/settings', component: Settings},
  { path: '/library', component: Library},
  { path: '/read/:bookId/:pageIndex', component: Book},
  { path: '/read/:bookId', component: Book },
  { path: '/login',component: LoginForm},
  { path: '/pinboard', component: Pinboard},
  { path: '*', redirect: '/' }
];

const router = new VueRouter({
  routes // short for `routes: routes`
})

import App from '../imports/ui/App.vue'

// for Vuetify 2.x you also need:
const vuetify = new Vuetify({theme: {themes: {light: {accent: 'FFFFFF'}}}});

Meteor.startup(() => {
  new Vue({
    el: '#app',
    router,
    vuetify, // this bit is also needed for Vuetify 2.x
    ...App,
  })
})
