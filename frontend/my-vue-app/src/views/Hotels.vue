<template>
  <div style="padding: 24px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <h2>Quản lý Khách sạn</h2>
      <a-button v-if="userRole === 'ADMIN'" type="primary" @click="openModal()">Thêm khách sạn</a-button>
    </div>

    <a-table :columns="columns" :data-source="hotels" rowKey="id" bordered>
      <template #bodyCell="{ column, record }">
    
        <template v-if="column.dataIndex === 'imageUrl'">
          <img 
            v-if="record.imageUrl" 
            :src="record.imageUrl" 
            alt="Ảnh khách sạn" 
            style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;" 
          />
          <span v-else>Trống</span>
        </template>

        <template v-else-if="column.dataIndex === 'hotelLink'">
          <a 
            v-if="record.hotelLink" 
            :href="record.hotelLink" 
            target="_blank" 
          >
            Truy cập
          </a>
          <span v-else>Trống</span>
        </template>

        <template v-else-if="column.key === 'actions'">
          <a-button type="primary" size="small" style="margin-right: 8px;" @click="openModal(record)">Sửa</a-button>
          <a-button danger size="small" @click="deleteHotel(record.id)">Xóa</a-button>
        </template>

      </template>
    </a-table>

    <a-modal v-model:open="isModalVisible" :title="isEdit ? 'Sửa' : 'Thêm'" @ok="saveHotel" @cancel="isModalVisible = false">
      <a-form layout="vertical" @submit.prevent>
        
        <a-form-item label="Tên khách sạn">
          <a-input v-model:value="form.name" placeholder="VD: Mường Thanh Luxury" />
        </a-form-item>
        
        <a-form-item label="Địa chỉ">
          <a-input v-model:value="form.address" placeholder="VD: 123 Đường ABC, Hà Nội" />
        </a-form-item>
        
        <a-form-item label="Giá (VNĐ)">
          <a-input-number v-model:value="form.price" style="width: 100%;" placeholder="VD: 500000" />
        </a-form-item>

        <a-form-item label="Đường dẫn ảnh (URL)">
          <a-input v-model:value="form.imageUrl" placeholder="Dán link ảnh vào đây (https://...)" />
          
          <div v-if="form.imageUrl" style="margin-top: 10px; text-align: center;">
            <p style="font-size: 12px; color: gray; margin-bottom: 5px;">Xem trước ảnh:</p>
            <img :src="form.imageUrl" style="max-width: 100%; height: 120px; object-fit: cover; border-radius: 6px;" />
          </div>
        </a-form-item>

        <a-form-item label="Link trang web khách sạn">
          <a-input v-model:value="form.hotelLink" placeholder="VD: https://booking.com/..." />
        </a-form-item>

      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { message } from 'ant-design-vue';

const hotels = ref([]);
const isModalVisible = ref(false);
const isEdit = ref(false);

// THÊM: Lấy quyền của người dùng hiện tại từ bộ nhớ
const userRole = ref(localStorage.getItem('role') || 'USER');

const form = ref({ 
  id: null, 
  name: '', 
  address: '', 
  price: '', 
  imageUrl: '', 
  hotelLink: '' 
});

// THÊM: Tách mảng columns thành dạng động
const baseColumns = [
  { title: 'Hình ảnh', dataIndex: 'imageUrl', key: 'imageUrl', width: '120px' },
  { title: 'Tên', dataIndex: 'name' },
  { title: 'Địa chỉ', dataIndex: 'address' },
  { title: 'Giá', dataIndex: 'price' },
  { title: 'Link Web', dataIndex: 'hotelLink', key: 'hotelLink' }
];

const columns = ref([...baseColumns]);

// THÊM: Nếu là ADMIN thì mới hiển thị cột Hành động (Sửa/Xóa)
if (userRole.value === 'ADMIN') {
  columns.value.push({ title: 'Hành động', key: 'actions' });
}

const openModal = (record) => {
  isEdit.value = !!record;
  form.value = record 
    ? { ...record } 
    : { id: null, name: '', address: '', price: '', imageUrl: '', hotelLink: '' }; 
  isModalVisible.value = true;
};

// Hàm lưu dữ liệu
const saveHotel = async () => {
  try {
    const payload = {
      ...form.value,
      price: form.value.price === '' ? 0 : Number(form.value.price)
    };

    if (isEdit.value) {
      await api.put(`/hotels/${form.value.id}`, payload); 
      message.success("Cập nhật khách sạn thành công!");
    } else {
      await api.post('/hotels', payload); 
      message.success("Thêm khách sạn thành công!");
    }

    isModalVisible.value = false;
    fetchHotels();
  } catch (error) {
    message.error("Lỗi khi lưu! Vui lòng kiểm tra lại.");
    console.error(error);
  }
};

const fetchHotels = async () => {
  try {
    const res = await api.get('/hotels'); 
    hotels.value = res.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách:", error);
  }
};

const deleteHotel = async (id) => {
  try {
    await api.delete(`/hotels/${id}`);
    message.success("Đã xóa khách sạn!");
    fetchHotels(); 
  } catch (error) {
    console.error("Lỗi xóa khách sạn:", error);
    message.error("Lỗi khi xóa!");
  }
};

onMounted(fetchHotels);
</script>