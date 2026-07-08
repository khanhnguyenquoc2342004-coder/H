<template>
  <div>
    <h2>Danh sách người dùng (Chỉ có token mới xem được)</h2>
    <button @click="logout">Đăng xuất</button>

    <table border="1" style="width: 100%; margin-top: 20px;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên tài khoản</th>
          <th style="text-align: center;">Hành động</th> 
        </tr>
      </thead>
      
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          
          <td style="text-align: center;"> 
            <button @click="updateUser(user.id, user.username)" style="color: blue; margin-right: 10px;">Sửa</button>
            <button @click="deleteUser(user.id)" style="color: red;">Xóa</button>
          </td>
          
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const users = ref([]);
const router = useRouter();

const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    users.value = response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      logout();
    } else {
      alert('Lỗi lấy dữ liệu!');
    }
  }
};
const updateUser = async (id, oldUsername) => {
  // Hiển thị hộp thoại nhập tên mới, điền sẵn tên cũ
  const newUsername = prompt("Nhập tên tài khoản mới:", oldUsername);
  
  if (newUsername && newUsername.trim() !== "" && newUsername !== oldUsername) {
    try {
      await api.put(`/users/${id}`, { username: newUsername });
      fetchUsers(); // Tải lại bảng sau khi sửa thành công
    } catch (error) {
      alert("Lỗi: Không thể cập nhật hoặc tên tài khoản đã tồn tại!");
    }
  }
};

const deleteUser = async (id) => {
  if(confirm("Bạn có chắc chắn muốn xóa user này?")) {
    try {
      await api.delete(`/users/${id}`);
      fetchUsers(); // Load lại danh sách sau khi xóa
    } catch (error) {
      alert('Không thể xóa!');
    }
  }
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

onMounted(() => {
  fetchUsers();
});
</script>