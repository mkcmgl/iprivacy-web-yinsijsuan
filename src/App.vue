<template>
	<el-config-provider :size="getGlobalComponentSize" :locale="zhCn">
		<router-view v-show="setLockScreen" />
		<Setings ref="setingsRef" v-show="setLockScreen" />
	</el-config-provider>
</template>

<script setup lang="ts" name="app">
import { defineAsyncComponent, computed, ref, onBeforeMount, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes';
import { useThemeConfig } from '@/stores/themeConfig';
import other from '@/utils/other';
import { Local, Session } from '@/utils/storage';
import mittBus from '@/utils/mitt';
import setIntroduction from '@/utils/setIconfont';

// 引入组件
const Setings = defineAsyncComponent(() => import('@/layout/navBars/breadcrumb/setings.vue'));

// 定义变量内容
const setingsRef = ref();
const route = useRoute();
const stores = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

// 设置锁屏时组件显示隐藏
const setLockScreen = computed(() => {
	// 防止锁屏后，刷新出现不相关界面
	return themeConfig.value.isLockScreen ? themeConfig.value.lockScreenTime > 1 : themeConfig.value.lockScreenTime >= 0;
});
// 获取全局组件大小
const getGlobalComponentSize = computed(() => {
	return other.globalComponentSize();
});
// 设置初始化，防止刷新时恢复默认
onBeforeMount(() => { });
// 页面加载时
onMounted(() => {
	nextTick(() => {
		// 监听布局配'置弹窗点击打开
		mittBus.on('openSetingsDrawer', () => {
			setingsRef.value.openDrawer();
		});
		// 获取缓存中的布局配置
		if (Session.get('themeConfig')) {
			storesThemeConfig.setThemeConfig({ themeConfig: Session.get('themeConfig') });
			document.documentElement.style.cssText = Local.get('themeConfigStyle');
		}
		// 获取缓存中的全屏配置
		if (Session.get('isTagsViewCurrenFull')) {
			stores.setCurrenFullscreen(Session.get('isTagsViewCurrenFull'));
		}
	});
});
// 页面销毁时，关闭监听布局配置/i18n监听
onUnmounted(() => {
	mittBus.off('openSetingsDrawer', () => { });
});
// 监听路由的变化，设置网站标题
watch(
	() => route.path,
	() => {
		other.useTitle();
	},
	{
		deep: true,
	}
);
</script>
