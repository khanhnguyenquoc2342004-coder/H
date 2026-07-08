import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Đảm bảo anh đã tạo thư mục router và file index.js bên trong

const app = createApp(App);
app.use(router);
app.mount('#app');