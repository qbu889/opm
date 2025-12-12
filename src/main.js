import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from './services/api';

const app = createApp(App);

// 全局注册 API 服务
app.config.globalProperties.$api = api;

app.use(router);
app.mount('#app');