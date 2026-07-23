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

    <a-modal v-model:open="isModalVisible" :title="isEdit ? 'Sửa' : 'Thêm'" @ok="submitHotel" @cancel="isModalVisible = false">
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
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';

const store = useStore();

const userRole = computed(() => store.state.userRole);
const hotels = computed(() => store.state.hotels);

const isModalVisible = ref(false);
const isEdit = ref(false);

const form = ref({ 
  id: null, name: '', address: '', price: '', imageUrl: '', hotelLink: ''
});

const columns = computed(() => {
  const baseCols = [
    { title: 'Hình ảnh', dataIndex: 'imageUrl', key: 'imageUrl', width: '120px' },
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Địa chỉ', dataIndex: 'address' },
    { title: 'Giá', dataIndex: 'price' },
    { title: 'Link Web', dataIndex: 'hotelLink', key: 'hotelLink' }
  ];

  if (userRole.value === 'ADMIN') {
    baseCols.push({ title: 'Hành động', key: 'actions' });
  }
  return baseCols;
});

const openModal = (record) => {
  isEdit.value = !!record;
  // Reset lại form chuẩn
  form.value = record 
    ? { ...record } 
    : { id: null, name: '', address: '', price: '', imageUrl: '', hotelLink: '' }; 
  isModalVisible.value = true;
};

const fetchHotels = async () => {
  await store.dispatch('fetchHotels');
};

const submitHotel = async () => {
  try {
    const payload = {
      ...form.value,
      price: form.value.price === '' ? 0 : Number(form.value.price)
    };

  
    await store.dispatch('saveHotel', payload);

    if (isEdit.value) {
      message.success("Cập nhật khách sạn thành công!");
    } else {
      message.success("Thêm khách sạn thành công!"); 
    }

    isModalVisible.value = false;
  } catch (error) {
    message.error("Lỗi khi lưu! Vui lòng kiểm tra lại.");
    }
};

const deleteHotel = async (id) => {
  try {
    await store.dispatch('deleteHotel', id);
    message.success("Đã xóa khách sạn!");
  } catch (error) {
    console.error("Lỗi xóa khách sạn:", error);
    message.error("Lỗi khi xóa!");
  }
};

onMounted(() => {
  fetchHotels();
});
</script>