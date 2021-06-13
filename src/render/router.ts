import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('./views/Index.vue'),
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/Settings.vue'),
      meta: {
        title: 'Settings',
      },
    },
  ],
});

export default router;
