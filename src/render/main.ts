import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './assets/css/tailwind.css';
import './assets/css/main.css';

const electron = require('electron');
const ipc = electron.ipcRenderer;

ipc.send('store:set', { key: 'foo.bar', value: '👩' });
ipc.invoke('store:get', 'foo').then((res: string) => {
  console.log(res);
});
ipc.send('store:delete', 'foo');
ipc.invoke('store:get', 'foo').then((res: string) => {
  console.log(res);
});

const app = createApp(App);

app.use(router);
app.mount('#app');
