// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import 'animate.css';

import App from './App';
import store from './store/store';

import Blank from './components/blank';
import Newqn from './components/newqn';
import List from './components/list';
import Fillqn from './components/fillqn';
import Viewdata from './components/viewdata';
import Alert from './components/alert';

Vue.use(VueRouter);
Vue.component('my-alert', Alert);

const router = new VueRouter({
  moder: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      component: Blank,
    },
    {
      path: '/newqn',
      component: Newqn,
    },
    {
      path: '/list',
      component: List,
    },
    {
      path: '/fillqn',
      component: Fillqn,
    },
    {
      path: '/viewdata',
      component: Viewdata,
    },
  ],
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App,
  },
});
