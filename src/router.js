import Vue from 'vue';
import Router from 'vue-router';
import Auth from '@aws-amplify/auth';
import store from './store';
import LandingPage from './views/LandingPage.vue';

Vue.use(Router);

const requireAuth = (to, from, next) => (store.state.userIsAuthenticated ? next() : next({ name: 'login', query: { redirect: to.path } }));
const requireGuest = (to, from, next) => (!store.state.userIsAuthenticated ? next() : next({ name: 'landingPage' }));

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'landingPage',
      component: LandingPage,
      beforeEnter: (to, from, next) => (!store.state.userIsAuthenticated ? next() : next({ name: 'list' })),
    },
    {
      path: '/list',
      name: 'list',
      component: () => import(/* webpackChunkName: "brewlist" */ './views/BrewList.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/new',
      name: 'new',
      component: () => import(/* webpackChunkName: "newbrew" */ './views/NewBrew.vue'),
      beforeEnter: requireAuth,
      props: true,
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import(/* webpackChunkName: "settings" */ './views/SettingsPage.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/signup',
      name: 'signup',
      // route level code-splitting
      // this generates a separate chunk (signup.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "signup" */ './views/SignupPage.vue'),
      props: (route) => ({ redirect: route.query.redirect }),
      beforeEnter: requireGuest,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/LoginPage.vue'),
      props: (route) => ({ redirect: route.query.redirect }),
      beforeEnter: requireGuest,
    },
    {
      path: '*',
      name: '404',
      component: () => import(/* webpackChunkName: "404" */ './views/404.vue'),
    },
  ],
});

const initAuth = Auth.currentAuthenticatedUser()
  .then(user => {
    store.dispatch('login', user); // don't wait
  }).catch(async () => {
    store.dispatch('logout'); // don't wait
  });

router.beforeEach(async (to, from, next) => {
  await initAuth;
  next();
});

export default router;
