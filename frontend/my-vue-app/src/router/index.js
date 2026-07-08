import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Users from '../views/Users.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/users', component: Users, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard để chặn vào trang Users nếu chưa đăng nhập
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('token');
  if (to.meta.requiresAuth && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;