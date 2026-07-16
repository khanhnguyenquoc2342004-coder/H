<template>
  <div class="home-container">
    <header class="header-top">
      <div class="logo">HotelBooking.com</div>
      <div class="header-right">
        <template v-if="isLoggedIn">
          <router-link v-if="userRole === 'ADMIN'" to="/admin/users" class="admin-link">Trang Quản Trị</router-link>
          <a @click="handleLogout" class="login-link">Đăng xuất</a>
        </template>
        <template v-else>
          <router-link to="/login" class="login-link">Đăng nhập</router-link>
        </template>
        <span class="lang"><global-outlined /> Tiếng Việt</span>
      </div>
    </header>

    <div class="hero-section">
      <div class="nav-categories">
        <span class="category-item active"><home-outlined /> Lưu trú</span>
        <span class="category-item"><rocket-outlined /> Chuyến bay</span>
        <span class="category-item"><car-outlined /> Thuê xe</span>
        <span class="category-item"><environment-outlined /> Hoạt động</span>
        <span class="category-item"><comment-outlined /> Taxi sân bay</span>
      </div>

      <div class="hero-content">
        <h1 class="hero-title">Tìm chỗ nghỉ tiếp theo</h1>
        <p class="hero-subtitle">Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...</p>
        <a-button class="explore-btn" ghost>Khám phá &rarr;</a-button>
      </div>

      <div class="search-wrapper">
        <div class="search-box">
          <div class="search-field">
            <search-outlined class="search-icon" />
            <input 
              v-model="searchKeyword" 
              type="text" 
              placeholder="Nhập tên khách sạn hoặc địa điểm" 
              class="custom-input" 
              @keyup.enter="handleSearch"
            />
          </div>
          <button class="btn-search" @click="handleSearch">Tìm</button>
        </div>
      </div>
    </div>

    <div class="hotel-list-section" style="padding-top: 80px; padding-bottom: 60px;">
      
      <div v-if="isLoggedIn && hotels.length > 0" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Các chỗ nghỉ nổi bật dành cho bạn</h2>
        
        <a-row :gutter="[24, 24]" v-if="filteredHotels.length > 0">
          <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="hotel in filteredHotels" :key="hotel.id">
            <a-card hoverable style="width: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              
              <template #cover>
                <a-carousel 
                  v-if="hotel.images && hotel.images.length > 0" 
                  autoplay 
                  arrows
                  style="height: 200px; overflow: hidden;"
                >
                  <div v-for="(img, index) in hotel.images" :key="index">
                    <img 
                      :alt="hotel.name" 
                      :src="img" 
                      style="height: 200px; width: 100%; object-fit: cover;" 
                    />
                  </div>
                </a-carousel>
                
                <img 
                  v-else
                  :alt="hotel.name" 
                  src="https://via.placeholder.com/300x200?text=No+Image" 
                  style="height: 200px; width: 100%; object-fit: cover;" 
                />
              </template>
              
              <a-card-meta :title="hotel.name">
                <template #description>
                  <p style="margin-bottom: 8px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    <environment-outlined style="color: #0071c2; margin-right: 4px;" />
                    {{ hotel.address }}
                  </p>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <span style="font-size: 16px; font-weight: bold; color: #e53935;">
                      {{ hotel.price.toLocaleString('vi-VN') }} ₫
                    </span>
                    
                    <a :href="hotel.hotelLink" target="_blank" v-if="hotel.hotelLink">
                      <a-button type="primary" size="small" style="background-color: #0071c2; border-color: #0071c2;">Chi tiết</a-button>
                    </a>
                  </div>
                </template>
              </a-card-meta>
              
            </a-card>
          </a-col>
        </a-row>

        <div v-else style="text-align: center; padding: 40px 0; color: #888;">
          Không tìm thấy khách sạn nào phù hợp với từ khóa: <strong>"{{ searchKeyword }}"</strong>
        </div>
      </div>

      <div v-else-if="!isLoggedIn" style="text-align: center; margin: 40px auto;">
        <h3 style="color: #333; font-size: 20px; margin-bottom: 12px;">Đăng nhập để xem các ưu đãi tốt nhất</h3>
        <p style="color: #666; margin-bottom: 20px;">Hàng nghìn khách sạn và chỗ nghỉ đang chờ bạn khám phá.</p>
        <router-link to="/login">
          <a-button type="primary" size="large" style="background-color: #0071c2;">Đăng nhập ngay</a-button>
        </router-link>
      </div>

      <div v-else style="text-align: center; margin: 40px auto; color: gray;">
        Đang tải dữ liệu...
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api'; 
import { 
  HomeOutlined, 
  RocketOutlined, 
  CarOutlined, 
  EnvironmentOutlined, 
  CommentOutlined,
  SearchOutlined,
  GlobalOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const searchKeyword = ref('');

const isLoggedIn = ref(false);
const userRole = ref('');
const hotels = ref([]); 
const filteredHotels = ref([]); 

const fetchHotels = async () => {
  try {
    const res = await api.get('/hotels');
    
    hotels.value = res.data.map(hotel => {
      let imagesArray = [];
      
      if (Array.isArray(hotel.images)) {
        imagesArray = hotel.images;
      } 
      else if (typeof hotel.imageUrl === 'string') {
        imagesArray = hotel.imageUrl.split(',').map(url => url.trim());
      }
      else if (typeof hotel.imageUrl === 'string' && hotel.imageUrl) {
        imagesArray = [hotel.imageUrl];
      }

      return {
        ...hotel,
        images: imagesArray 
      };
    });

    filteredHotels.value = hotels.value;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khách sạn:", error);
  }
};

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    isLoggedIn.value = true;
    userRole.value = localStorage.getItem('role') || 'USER';
    fetchHotels(); 
  } else {
    isLoggedIn.value = false;
  }
});

const handleSearch = () => {
  const keyword = searchKeyword.value.toLowerCase().trim();
  if (!keyword) {
    filteredHotels.value = hotels.value;
  } else {
    filteredHotels.value = hotels.value.filter(hotel => 
      hotel.name.toLowerCase().includes(keyword) || 
      (hotel.address && hotel.address.toLowerCase().includes(keyword))
    );
  }
};

watch(searchKeyword, (newValue) => {
  if (!newValue) {
    filteredHotels.value = hotels.value;
  }
});

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role'); 
  isLoggedIn.value = false;
  hotels.value = []; 
  filteredHotels.value = [];
};
</script>

<style scoped>
.home-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header-top {
  background-color: #003580;
  padding: 15px 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: white;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
  color: white;
}

.admin-link, .login-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.admin-link:hover, .login-link:hover {
  text-decoration: underline;
}

.lang {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), 
  url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600') no-repeat center center;
  background-size: cover;
  padding: 20px 120px 100px 120px;
  position: relative;
}

.nav-categories {
  display: flex;
  gap: 8px;
  margin-bottom: 50px;
}

.category-item {
  color: white;
  padding: 10px 18px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: background 0.3s;
}

.category-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.category-item.active {
  border: 1px solid white;
  background: rgba(255, 255, 255, 0.15);
}

.hero-content {
  margin-bottom: 50px;
}

.hero-title {
  color: white;
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 12px;
}

.hero-subtitle {
  color: white;
  font-size: 23px;
  margin-bottom: 28px;
}

.explore-btn {
  border-radius: 4px;
  font-size: 15px;
  padding: 0 24px;
  height: 44px;
}

.search-wrapper {
  position: absolute;
  bottom: -28px;
  left: 120px;
  right: 120px;
  z-index: 10; 
}

.search-box {
  background-color: #febb02;
  padding: 4px;
  border-radius: 8px;
  display: flex;
  gap: 4px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

.search-field {
  background: white;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-radius: 4px;
}

.search-icon {
  color: #555;
  font-size: 20px;
  margin-right: 12px;
}

.custom-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 16px;
  color: #333;
  height: 52px;
}

.btn-search {
  background-color: #0071c2;
  color: white;
  border: none;
  padding: 0 36px;
  font-size: 20px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-search:hover {
  background-color: #005998;
}

:deep(.slick-dots) {
  bottom: 10px !important;
}
:deep(.slick-dots li button) {
  background: rgba(255, 255, 255, 0.5) !important;
  height: 4px !important;
  border-radius: 2px !important;
}
:deep(.slick-dots li.slick-active button) {
  background: #fff !important;
  width: 24px !important;
}
</style> 