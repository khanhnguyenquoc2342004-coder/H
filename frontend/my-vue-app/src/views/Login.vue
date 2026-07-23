<template>
  <div class="login-wrapper">
    <div class="login-banner">
      <div class="banner-overlay">
        <h1 class="brand-name">Global Hotel Solutions</h1>
        <p class="brand-slogan">Nền tảng quản lý đặt phòng và dịch vụ lưu trú hàng đầu.</p>
      </div>
    </div>

    <div class="login-form-container">
      <div class="form-box">
        <h2 class="form-title">Chào mừng trở lại! 👋</h2>
        <p class="form-subtitle">Vui lòng đăng nhập hoặc tạo tài khoản để tiếp tục.</p>

        <a-tabs v-model:activeKey="activeTab" class="custom-tabs" centered>
          
          <a-tab-pane key="login" tab="Đăng nhập">
            <a-form layout="vertical" :model="loginForm" @finish="handleLogin">
              <a-form-item 
                label="Tên tài khoản" 
                name="username" 
                :rules="[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]"
              >
                <a-input v-model:value="loginForm.username" size="large" placeholder="Nhập tên tài khoản">
                  <template #prefix><UserOutlined class="input-icon" /></template>
                </a-input>
              </a-form-item>

              <a-form-item 
                label="Mật khẩu" 
                name="password" 
                :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]"
              >
                <a-input-password v-model:value="loginForm.password" size="large" placeholder="Nhập mật khẩu">
                  <template #prefix><LockOutlined class="input-icon" /></template>
                </a-input-password>
              </a-form-item>

              <div class="form-actions">
                <a-checkbox v-model:checked="loginForm.remember">Ghi nhớ đăng nhập</a-checkbox>
                <a class="forgot-link">Quên mật khẩu?</a>
              </div>

              <a-button type="primary" html-type="submit" size="large" block class="submit-btn" :loading="isLoading">
                Đăng Nhập
              </a-button>
            </a-form>
          </a-tab-pane>

          <a-tab-pane key="register" tab="Đăng ký">
            <a-form layout="vertical" :model="registerForm" @finish="handleRegister">
              <a-form-item 
                label="Tên tài khoản" 
                name="username" 
                :rules="[{ required: true, message: 'Vui lòng chọn một tên tài khoản!' }]"
              >
                <a-input v-model:value="registerForm.username" size="large" placeholder="Nhập tên tài khoản mới">
                  <template #prefix><UserOutlined class="input-icon" /></template>
                </a-input>
              </a-form-item>

              <a-form-item 
                label="Mật khẩu" 
                name="password" 
                :rules="[{ required: true, message: 'Vui lòng tạo mật khẩu!' }]"
              >
                <a-input-password v-model:value="registerForm.password" size="large" placeholder="Mật khẩu (Ít nhất 6 ký tự)">
                  <template #prefix><LockOutlined class="input-icon" /></template>
                </a-input-password>
              </a-form-item>

              <a-button type="primary" html-type="submit" size="large" block class="submit-btn" :loading="isLoading">
                Tạo Tài Khoản
              </a-button>
            </a-form>
          </a-tab-pane>
        </a-tabs>

        <div class="divider"><span>Hoặc đăng nhập bằng</span></div>
        <div class="social-login">
          <a-button size="large" class="social-btn">
            <GoogleOutlined style="color: #db4437; font-size: 18px;" /> Google
          </a-button>
          <a-button size="large" class="social-btn">
            <FacebookOutlined style="color: #4267B2; font-size: 18px;" /> Facebook
          </a-button>
        </div>

        <div class="back-home">
          <router-link to="/">&larr; Quay lại Trang chủ</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const store = useStore(); 
const activeTab = ref('login');
const isLoading = ref(false);

const loginForm = reactive({ username: '', password: '', remember: false });
const registerForm = reactive({ username: '', password: '' });

// --- XỬ LÝ ĐĂNG NHẬP VỚI VUEX ---
const handleLogin = async () => {
  isLoading.value = true;
  try {
    await store.dispatch('login', {
      username: loginForm.username,
      password: loginForm.password
    });
    
    message.success('Đăng nhập thành công!');
    
    // 2. Lấy role trực tiếp từ Vuex để điều hướng
    const role = store.state.userRole; 
    
    if (role === 'ADMIN') {
      router.push('/admin/users');
    } else {
      router.push('/');
    }

  } catch (error) {
    message.error('Sai tài khoản hoặc mật khẩu!');
  } finally {
    isLoading.value = false;
  }
};

// --- XỬ LÝ ĐĂNG KÝ (Giữ nguyên gọi API cục bộ vì không ảnh hưởng state chung) ---
const handleRegister = async () => {
  isLoading.value = true;
  try {
    await store.dispatch('register', {
      username: registerForm.username,
      password: registerForm.password
    });
    
    message.success('Đăng ký thành công! Vui lòng đăng nhập.');
    
    activeTab.value = 'login';
    loginForm.username = registerForm.username;
    registerForm.username = '';
    registerForm.password = '';
    
  } catch (error) {
    message.error(error.response?.data || 'Đăng ký thất bại!');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>

* { box-sizing: border-box; }
.login-wrapper { display: flex; min-height: 100vh; background-color: #fff; }
.login-banner { flex: 1; background: url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600') no-repeat center center; background-size: cover; position: relative; display: none; }
@media (min-width: 900px) { .login-banner { display: block; } }
.banner-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0, 53, 128, 0.6), rgba(0, 0, 0, 0.8)); display: flex; flex-direction: column; justify-content: center; padding: 60px; color: white; }
.brand-name { font-size: 48px; font-weight: 700; color: white; margin-bottom: 16px; letter-spacing: 1px; }
.brand-slogan { font-size: 18px; line-height: 1.6; opacity: 0.9; max-width: 500px; }
.login-form-container { flex: 1; display: flex; justify-content: center; align-items: center; padding: 40px 20px; background-color: #f9fafb; }
.form-box { width: 100%; max-width: 420px; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.05); }
.form-title { font-size: 26px; font-weight: 700; color: #111827; margin-bottom: 8px; }
.form-subtitle { color: #6b7280; margin-bottom: 24px; font-size: 14px; }
.input-icon { color: #9ca3af; }
.form-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; font-size: 14px; }
.forgot-link { color: #0071c2; font-weight: 500; }
.forgot-link:hover { text-decoration: underline; }
.submit-btn { background-color: #0071c2; border-color: #0071c2; font-weight: 600; height: 44px; border-radius: 6px; }
.submit-btn:hover { background-color: #005998; border-color: #005998; }
.divider { display: flex; align-items: center; text-align: center; margin: 24px 0; color: #9ca3af; font-size: 13px; }
.divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #e5e7eb; }
.divider span { padding: 0 10px; }
.social-login { display: flex; gap: 12px; }
.social-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; height: 44px; border-radius: 6px; font-weight: 500; color: #374151; }
.back-home { margin-top: 32px; text-align: center; font-size: 14px; }
.back-home a { color: #6b7280; transition: color 0.3s; }
.back-home a:hover { color: #0071c2; }
:deep(.ant-tabs-nav::before) { border-bottom: 1px solid #e5e7eb; }
:deep(.ant-tabs-tab) { font-size: 16px; padding: 12px 0; }
:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) { color: #0071c2; font-weight: 600; }
:deep(.ant-tabs-ink-bar) { background: #0071c2; }
</style>