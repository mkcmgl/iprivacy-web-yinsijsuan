<template>
	<div class="document-container layout-padding">
		<el-card shadow="never" class="mt20 mb20" style="min-width: 800px">
			<vue-mark-down class="markdown" :md-html="state.htmlMD"> </vue-mark-down>
		</el-card>
	</div>
</template>
<script lang="ts" setup name="document">
import { onMounted, reactive, defineAsyncComponent } from 'vue';
import { getDetailMain } from '@/api/document';
import axios from 'axios';
const VueMarkDown = defineAsyncComponent(() => import('@/components/vueMarkDown/markdown.vue'));

const state = reactive({
	flag: true,
	symbol: '',
	htmlMD: '',
	tocHtmlStr: '',
});

onMounted(() => {
	getDetailMain({
		id: '17',
	}).then((res) => {
		axios({
			url: res.data.dictDesc,
			method: 'get',
		})
			.then((doc) => {
				state.htmlMD = doc.data;
			})
			.catch((err) => console.error(err));
	});
});
</script>
<style>
.markdown .table td,
.markdown .table th {
	word-break: keep-all;
}
</style>
<style lang="scss" scoped>
.document-container :deep(.el-card__body) {
	padding: 0px 30px;
}

.document-container ::-webkit-scrollbar {
	display: none; /* Chrome Safari */
}
</style>
