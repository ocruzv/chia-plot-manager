import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import router from '@/router';

import '@/assets/css/tailwind.css';
import '@/assets/css/main.css';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.mount('#app');
