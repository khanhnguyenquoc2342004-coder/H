<template>
  <div style="padding: 24px; background-color: #f5f7fa; min-height: 100vh;">
    <a-card :bordered="false" style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      
      <!-- Phần Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 600;">Danh sách Người dùng</h2>
          <a-tag style="border-radius: 12px; font-size: 14px; padding: 2px 10px; background: #e6f7ff; border: 1px solid #91d5ff; color: #1890ff;">
            Tổng: {{ users.length }}
          </a-tag>
        </div>
        
        <div style="display: flex; gap: 12px;">
          <!-- CREATE: Nút Thêm mới -->
          <a-button type="primary" style="border-radius: 6px; background-color: #52c41a; border-color: #52c41a;" @click="openAddModal">
            <PlusOutlined /> Thêm mới
          </a-button>
          
        </div>
      </div>

      <!-- READ: Bảng hiển thị dữ liệu -->
      <a-table 
        :columns="columns" 
        :data-source="users" 
        :pagination="{ pageSize: 5 }" 
        rowKey="id"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'id'">
            <span style="font-weight: 600; color: #1890ff;">{{ record.id }}</span>
          </template>

          <template v-else-if="column.key === 'username'">
            <span style="font-size: 15px; color: #1f2937;">{{ record.username }}</span>
          </template>

          <template v-else-if="column.key === 'actions'">
            <div style="display: flex; justify-content: center; gap: 8px;">
              
              <!-- UPDATE: Nút mở form sửa -->
              <a-tooltip title="Chỉnh sửa">
                <a-button shape="circle" size="middle" @click="openEditModal(record)">
                  <template #icon><EditOutlined style="color: #1890ff;" /></template>
                </a-button>
              </a-tooltip>

              <!-- DELETE: Nút xóa có xác nhận -->
              <a-tooltip title="Xóa tài khoản">
                <a-popconfirm 
                  title="Xóa tài khoản này?" 
                  ok-text="Xóa" 
                  cancel-text="Hủy" 
                  @confirm="deleteUser(record.id)"
                >
                  <a-button danger shape="circle" size="middle">
                    <template #icon><DeleteOutlined /></template>
                  </a-button>
                </a-popconfirm>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- MODAL DÙNG CHUNG CHO CREATE VÀ UPDATE -->
    <a-modal
      v-model:open="isModalVisible"
      :title="isEditMode ? 'Cập nhật tài khoản' : 'Thêm tài khoản mới'"
      @ok="handleSave"
      ok-text="Lưu lại"
      cancel-text="Hủy"
      :okButtonProps="{ style: { borderRadius: '6px' } }"
      :cancelButtonProps="{ style: { borderRadius: '6px' } }"
    >
      <div style="margin-top: 16px;">
        <label style="font-weight: 500;">Tên tài khoản:</label>
        <a-input 
          v-model:value="formData.username" 
          placeholder="Nhập tên tài khoản" 
          style="margin-top: 8px; border-radius: 6px;" 
        />
      </div>

      <!-- Chỉ hiện ô nhập Mật khẩu khi tạo mới -->
      <div v-if="!isEditMode" style="margin-top: 16px;">
        <label style="font-weight: 500;">Mật khẩu:</label>
        <a-input-password 
          v-model:value="formData.password" 
          placeholder="Nhập mật khẩu" 
          style="margin-top: 8px; border-radius: 6px;" 
        />
      </div>
    </a-modal>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';

const users = ref([]);
const router = useRouter();

// Trạng thái của Modal
const isModalVisible = ref(false);
const isEditMode = ref(false);
const formData = reactive({
  id: null,
  username: '',
  password: '' // Backend Spring Boot thường cần pass khi tạo mới
});

const columns = [
  { title: 'ID', key: 'id', width: 100, align: 'center' },
  { title: 'Tên tài khoản', key: 'username' },
  { title: 'Hành động', key: 'actions', width: 150, align: 'center' },
];


// [READ] - Lấy danh sách
const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    users.value = response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách:", error);
  }
};

// Mở form Thêm mới
const openAddModal = () => {
  isEditMode.value = false;
  formData.id = null;
  formData.username = '';
  formData.password = '';
  isModalVisible.value = true;
};

// Mở form Sửa
const openEditModal = (record) => {
  isEditMode.value = true;
  formData.id = record.id;
  formData.username = record.username;
  formData.password = ''; // Không cần pass khi sửa tên
  isModalVisible.value = true;
};

// [CREATE & UPDATE] - Xử lý khi bấm nút Lưu trên Modal
const handleSave = async () => {
  if (!formData.username.trim()) {
    alert("Vui lòng nhập tên tài khoản!");
    return;
  }

  try {
    if (isEditMode.value) {
      // Gọi API PUT để Sửa
      await api.put(`/users/${formData.id}`, 
        { username: formData.username, password: formData.password }, 
       

      );  
    } else {
      // Gọi API POST để Thêm mới
      if (!formData.password.trim()) {
        alert("Vui lòng nhập mật khẩu!");
        return;
      }
    
      await api.post('/auth/register', 
        { username: formData.username, password: formData.password }, 
       
      );
    }
    
    isModalVisible.value = false; // Đóng modal
    fetchUsers(); // Tải lại bảng
  } catch (error) {
    alert("Lỗi thật sự là: " + error.message);
    console.error("Chi tiết lỗi:", error);
  }
};

// [DELETE] - Xóa người dùng
const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
    fetchUsers();
  } catch (error) {
    console.error("Lỗi xóa người dùng:", error);
  }
};


onMounted(() => {
  fetchUsers();
});
</script>