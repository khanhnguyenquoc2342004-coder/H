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
      </div>

      <div class="search-wrapper">
        <div class="search-box">
          <div class="search-field">
            <search-outlined class="search-icon" />
            <a-auto-complete
              v-model:value="searchKeyword"
              :options="locationOptions"
              :filter-option="filterLocation"
              placeholder="Nhập tên khách sạn hoặc tỉnh/thành phố"
              class="custom-auto-complete"
            />
          </div>
          <button class="btn-search">Tìm</button>
        </div>
      </div>
    </div>

    <div class="hotel-list-section" style="padding-top: 40px; padding-bottom: 60px;">
      
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
                    <img :alt="hotel.name" :src="img" style="height: 200px; width: 100%; object-fit: cover;" />
                  </div>
                </a-carousel>
                <img v-else :alt="hotel.name" src="https://via.placeholder.com/300x200?text=No+Image" style="height: 200px; width: 100%; object-fit: cover;" />
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

    <footer class="footer-section">
      <div class="footer-content">
        <div class="footer-column">
          <h4 class="footer-title">Hỗ trợ</h4>
          <a href="#">Trung tâm trợ giúp</a>
          <a href="#">Tư vấn an toàn</a>
          <a href="#">Hỗ trợ người khuyết tật</a>
          <a href="#">Tùy chọn hủy phòng</a>
        </div>
        <div class="footer-column">
          <h4 class="footer-title">Khám phá</h4>
          <a href="#">Chương trình khách hàng thân thiết</a>
          <a href="#">Đánh giá của khách</a>
          <a href="#">Khám phá theo chuyên mục</a>
          <a href="#">Các bài viết du lịch</a>
        </div>
        <div class="footer-column">
          <h4 class="footer-title">Đối tác</h4>
          <a href="#">Đăng chỗ nghỉ của bạn</a>
          <a href="#">Trung tâm đối tác</a>
          <a href="#">Trở thành đối tác liên kết</a>
        </div>
        <div class="footer-column">
          <h4 class="footer-title">HotelBooking.com</h4>
          <a href="#">Về chúng tôi</a>
          <a href="#">Cơ hội nghề nghiệp</a>
          <a href="#">Chính sách bảo mật</a>
          <a href="#">Điều khoản sử dụng</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 HotelBooking.com. Đã đăng ký Bản quyền.</p>
        <p>Website được tạo ra nhằm mục đích học tập và chia sẻ kiến thức.</p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex'; 
import { useRouter } from 'vue-router';
import { HomeOutlined, RocketOutlined, CarOutlined, EnvironmentOutlined, CommentOutlined, SearchOutlined, GlobalOutlined } from '@ant-design/icons-vue';

const store = useStore();
const router = useRouter();

const isLoggedIn = computed(() => store.state.isLoggedIn);
const userRole = computed(() => store.state.userRole);

const hotels = computed(() => store.state.hotels);
const searchKeyword = ref('');
const locationOptions = ref([]); 

const removeAccents = (str) => str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
const filterLocation = (inputValue, option) => removeAccents(option.value).includes(removeAccents(inputValue));

const filteredHotels = computed(() => {
  return store.getters.searchHotels(searchKeyword.value);
});

onMounted(() => {
  if (isLoggedIn.value) {
    store.dispatch('fetchHotels');
  }
});

const handleLogout = async () => {
  await store.dispatch('logout'); 
  window.location.reload();
};
</script>

<style scoped>
.custom-auto-complete { width: 100% !important; }
:deep(.ant-select-selector) { border: none !important; box-shadow: none !important; height: 52px !important; align-items: center; font-size: 16px; background: transparent !important; }
.home-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; min-height: 100vh; background-color: #f5f5f5; display: flex; flex-direction: column; }
.header-top { position: absolute; top: 0; left: 0; right: 0; z-index: 1000; background-color: transparent; padding: 20px 120px; display: flex; justify-content: space-between; align-items: center; }
.logo { color: white; font-size: 24px; font-weight: bold; cursor: pointer; }
.header-right { display: flex; align-items: center; gap: 24px; color: white; }
.admin-link, .login-link { color: white; text-decoration: none; font-weight: 500; cursor: pointer; }
.admin-link:hover, .login-link:hover { text-decoration: underline; }
.lang { cursor: pointer; display: flex; align-items: center; gap: 6px; }
.hero-section { background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600') no-repeat center center; background-size: cover; padding: 100px 120px 60px 120px; display: flex; flex-direction: column; }
.nav-categories { display: flex; gap: 8px; margin-bottom: 40px; }
.category-item { color: white; padding: 10px 18px; border-radius: 20px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; transition: background 0.3s; }
.category-item:hover { background: rgba(255, 255, 255, 0.1); }
.category-item.active { border: 1px solid white; background: rgba(255, 255, 255, 0.15); }
.hero-content { margin-bottom: 30px; }
.hero-title { color: white; font-size: 48px; font-weight: 700; margin-bottom: 12px; }
.hero-subtitle { color: white; font-size: 23px; margin-bottom: 28px; }
.search-wrapper { margin-top: 10px; z-index: 10; position: relative; }
.search-box { background-color: #febb02; padding: 4px; border-radius: 8px; display: flex; gap: 4px; box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
.search-field { background: white; flex: 1; display: flex; align-items: center; padding: 0 16px; border-radius: 4px; }
.search-icon { color: #555; font-size: 20px; margin-right: 12px; }
.btn-search { background-color: #0071c2; color: white; border: none; padding: 0 36px; font-size: 20px; font-weight: 500; border-radius: 4px; cursor: pointer; transition: background 0.3s; }
.btn-search:hover { background-color: #005998; }

:deep(.slick-dots) { bottom: 10px !important; }
:deep(.slick-dots li button) { background: rgba(255, 255, 255, 0.5) !important; height: 4px !important; border-radius: 2px !important; }
:deep(.slick-dots li.slick-active button) { background: #fff !important; width: 24px !important; }

.footer-section {
  background-color: #003580; 
  color: white;
  padding: 60px 120px 30px 120px;
  margin-top: auto; 
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-title {
  color: white;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.footer-column a {
  color: #cce1f8;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-column a:hover {
  color: #febb02; 
  text-decoration: underline;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #a0c3e8;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
  .footer-section, .header-top, .hero-section {
    padding-left: 40px;
    padding-right: 40px;
  }
}

@media (max-width: 576px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
  .footer-section, .header-top, .hero-section {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>