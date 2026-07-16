import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; 
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';// Đảm bảo anh đã tạo thư mục router và file index.js bên trong

const app = createApp(App);
app.use(router);
app.use(Antd);
app.mount('#app');  