<template>
  <div style="max-width: 300px; margin: auto; padding-top: 50px;">
    <h2>Đăng Nhập / Đăng Ký</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Tài khoản:</label>
        <input v-model="username" type="text" required />
      </div>
      <div style="margin-top: 10px;">
        <label>Mật khẩu:</label>
        <input v-model="password" type="password" required />
      </div>
      <div style="margin-top: 15px;">
        <button type="submit">Đăng Nhập</button>
        <button type="button" @click="handleRegister" style="margin-left: 10px;">Đăng Ký</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const username = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value
    });
    localStorage.setItem('token', response.data.token);
    alert('Đăng nhập thành công!');
    router.push('/users');
  } catch (error) {
    alert('Đăng nhập thất bại: Sai tài khoản hoặc mật khẩu');
  }
};

const handleRegister = async () => {
  try {
    await api.post('/auth/register', {
      username: username.value,
      password: password.value
    });
    alert('Đăng ký thành công! Vui lòng bấm Đăng nhập.');
  } catch (error) {
    alert('Đăng ký thất bại: Trùng tài khoản');
  }
};
</script>