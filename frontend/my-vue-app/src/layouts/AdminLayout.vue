<template>
  <a-layout style="min-height: 100vh">
    
    <a-layout-sider v-model:collapsed="collapsed" collapsible theme="dark">
      <div class="logo-admin">
        <h3 v-if="!collapsed" style="color: white; margin: 0; font-weight: bold;">GLOBAL HOTEL</h3>
      </div>
      
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" @click="handleMenuClick">
        <a-menu-item key="users">
          <team-outlined />
          <span>Quản lý Người dùng</span>
        </a-menu-item>
        
        <a-menu-item key="hotels">
          <home-outlined />
          <span>Quản lý Khách sạn</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="admin-header">
        <h2 class="header-title">Bảng Điều Khiển</h2>
        <div class="header-user">
          <router-link to="/" style="margin-right: 10px;">Về trang chủ</router-link>
          <span>Xin chào, Admin</span>
          <a-avatar style="background-color: #1890ff">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <a-button type="link" danger @click="logout">Đăng xuất</a-button>
        </div>
      </a-layout-header>

      <a-layout-content class="admin-content">
        <div class="content-body">
          <router-view />
        </div>
      </a-layout-content>

      <a-layout-footer style="text-align: center; color: #888;">
        Hệ thống Quản lý ©2026 - Phát triển với VueJS & Ant Design
      </a-layout-footer>
    </a-layout>

  </a-layout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex'; 
import { TeamOutlined, HomeOutlined, UserOutlined} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();
const store = useStore(); // Khởi tạo Store

const collapsed = ref(false);
const selectedKeys = ref([route.name || 'users']);

// Tự động đồng bộ menu sáng đèn theo URL hiện tại
watch(() => route.name, (newName) => {
  if (newName) selectedKeys.value = [newName];
});

const handleMenuClick = (e) => {
  router.push({ name: e.key });
};

// ĐÃ SỬA: Gọi action logout từ Vuex để dọn dẹp state trước khi chuyển trang
const logout = async () => {
  try {
    await store.dispatch('logout'); // Dọn dẹp kho dữ liệu tập trung
  } catch(e) {
    console.error(e);
  } finally {
    localStorage.removeItem('token');
    router.push({ name: 'login' });
  }
};
</script>

<style scoped>
.logo-admin {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.admin-header {
  background: #fff; 
  padding: 0 24px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  z-index: 1;
}
.header-title {
  margin: 0; 
  font-size: 18px; 
  font-weight: 600;
}
.header-user {
  display: flex; 
  align-items: center; 
  gap: 16px;
}
.admin-content {
  margin: 24px 16px;
}
.content-body {
  padding: 24px; 
  background: #fff; 
  min-height: 400px; 
  border-radius: 8px;
}
</style>