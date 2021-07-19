import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import App from '@/App.vue';
import router from '@/router';

// import '@/assets/css/tailwind.css';
// import '@/assets/css/main.css';
import 'ant-design-vue/dist/antd.less';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(Antd);
app.mount('#app');
