import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import Users from '../views/Users.vue';
import Hotels from '../views/Hotels.vue';
import store from '../store';

const routes = [
  // 1. TRANG CHỦ: Xuất hiện ngay lập tức khi mở web
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  // 2. CỤM TRANG QUẢN TRỊ: Yêu cầu quyền ADMIN mới được vào
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/users', 
    meta: { requiresAdmin: true }, // ĐÁNH DẤU CỤM NÀY CẦN QUYỀN ADMIN
    children: [
      {
        path: 'users',
        name: 'users',
        component: Users
      },
      {
        path: 'hotels',
        name: 'hotels',
        component: Hotels
      }
    ]
  },

  // 3. TRANG ĐĂNG NHẬP
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// BẢO VỆ ĐƯỜNG DẪN (ROUTE GUARD) SỬ DỤNG VUEX
router.beforeEach((to, from, next) => {
  
  // Lấy dữ liệu trực tiếp từ Vuex Store thay vì localStorage
  const isLoggedIn = store.state.isLoggedIn;
  const role = store.state.userRole;

  // Kiểm tra xem trang (route) chuẩn bị vào có yêu cầu quyền Admin không
  if (to.meta.requiresAdmin) {
    
    if (!isLoggedIn) {
      // Trường hợp 1: Chưa đăng nhập gì cả -> Đuổi về trang Login
      alert("Vui lòng đăng nhập để truy cập trang quản trị!");
      next('/login');
    } 
    else if (role !== 'ADMIN') {
      // Trường hợp 2: Đã đăng nhập nhưng là USER thường -> Đuổi về Trang chủ
      alert("Bạn không có quyền truy cập vào khu vực này!");
      next('/');
    } 
    else {
      // Trường hợp 3: Đã đăng nhập và đúng là ADMIN -> Mời vào
      next();
    }

  } else {
    // Nếu trang không yêu cầu quyền Admin (như Trang chủ, Trang Đăng nhập) -> Đi lại tự do
    next();
  }
});

export default router;