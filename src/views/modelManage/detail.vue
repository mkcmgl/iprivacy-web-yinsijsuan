<template>
	<div class="home-container layout-pd layout-padding">
		<el-card class="">
			<template #header>
				<div class="card-header">
					<p>数据详情</p>
				</div>
			</template>
			<div class="card-header-flex">
				<div class="w50">
					<div class="flex mg-b-20">
						<p class="w-100">节点名称：</p>
						<p>{{dataDetailMsg.nodeName}}</p>
					</div>
					<div class="flex mg-b-20">
						<p class="w-100">数据格式：</p>
						<p>{{dataDetailMsg.typeName}}</p>
					</div>
					<div class="flex mg-b-20">
						<p class="w-100">数据概述：</p>
						<p>{{ dataDetailMsg.description }}</p>
					</div>

				</div>
				<div class="w50">
					<div class="flex mg-b-20">
						<p class="w-100">节点ID：</p>
						<p class="word-break detail-text-width">{{ dataDetailMsg.nodeId }}</p>
					</div>
					<div class="flex mg-b-20">
						<p class="w-100">数据名称：</p>
						<p class="w-100">{{ dataDetailMsg.name }}</p>
					</div>
					<div class="flex mg-b-20">
						<p class="w-100">创建时间：</p>
						<p>{{ dataDetailMsg.createTime }}</p>
					</div>
				</div>
			</div>
			<div>
				<span>数据表结构：</span>
				<!-- <el-table class="mg-t-20" :data="dataDetailMsg.fieldList" border style="width: 50%">
					<el-table-column prop="name" label="字段名称" />
					<el-table-column prop="type" label="数据类型">
						<template #default="scope">
							<el-select disabled v-model="scope.row.type" placeholder="请选择状态" size="large" clearable>
								<el-option v-for="item in fieldTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="description" label="描述" />
				</el-table> -->
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
					<el-row :gutter="20" class="data-container" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
						<el-col  :span="12">
							<EditResourceTable border height="500" :fieldListLoading="fieldListLoading" :data="fieldList" :isEditable="isEditPage"  />
						</el-col>
						<el-col  :span="12">
							<ResourcePreviewTable :fieldListLoading="fieldListLoading" :data="dataList" height="500" />
						</el-col>
					</el-row>
				</el-col>
			</div>

			<!-- <template #footer>Footer content</template> -->
		</el-card>
	</div>
</template>

<script setup lang="ts" name="dataManageDetail">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs, computed } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';
import { dataDetail, dataFilePreview} from '@/api/dataManage';
import { DataDetailType } from '@/types/views';
const EditResourceTable = defineAsyncComponent(() => import('@/components/EditResourceTable/index.vue'));
const ResourcePreviewTable = defineAsyncComponent(() => import('@/components/ResourcePreviewTable/index.vue'));
const router = useRouter();
const route = useRoute();
const userInfos = useUserInfo();
const dataDetailMsg = ref(<DataDetailType>{});
const isEditPage=ref(false);
const fieldTypeList = [
	{
		value: 0,
		label: 'String',
	},
	{
		value: 1,
		label: 'Integer',
	},
	{
		value: 2,
		label: 'Double',
	},
	{
		value: 3,
		label: 'Long',
	},
	{
		value: 5,
		label: 'Boolean',
	},
];

onMounted(() => {
	getDataDetail();
});
const fieldListLoading = ref(false);
const dataList = ref([]);
const fieldList = ref([]);
const getDataDetail = () => {
	fieldListLoading.value = true;
	dataDetail({ dataId: route.query.id }).then((res) => {
		dataDetailMsg.value = res.data;
		dataList.value = res.data.previewData
		fieldList.value = res.data.fieldList;
		fieldListLoading.value = false;
		console.log(`output->dataDetailMsg`, dataDetailMsg);
		// fieldListLoading.value = true;
		// dataFilePreview({ fileId: dataDetailMsg.value.fileId }).then((res: any) => {
		// 	console.log(`output->res`, res);
		// 	dataList.value = res.data.dataList;
		// 	fieldList.value = res.data.fieldList;
		// 	console.log(`output->fileList.value`, dataList.value, fieldList.value);
		// 	fieldListLoading.value = false;
		// });
	});
};
</script>

<style scoped lang="scss"></style>
