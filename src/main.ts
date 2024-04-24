import { createApp, defineAsyncComponent } from 'vue';
import pinia from '@/stores/index';
import App from '@/App.vue';
import router from '@/router';
import { directive } from '@/directive/index';
import other from '@/utils/other';

import ElementPlus from 'element-plus';
import '@/theme/index.scss';
import md5 from 'js-md5';


const app = createApp(App);
app.config.globalProperties.$md5 = md5;

directive(app);
other.elSvg(app);

app.use(pinia).use(router).use(ElementPlus).mount('#app');
other.pagination(app);
