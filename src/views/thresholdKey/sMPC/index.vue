<template>
	<div class="sMPC-container layout-padding" v-loading="state.loading">
		<el-card shadow="never" class="search-box">
			<el-card shadow="never" v-for="(item, index) in state.tableData" :key="item.id" :class="{ mt20: index !== 0 }">
				<div class="title mb20">sMPC网络服务器</div>
				<el-form label-width="100px" label-position="left" size="large">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="用户ID：">{{ item.userId }}</el-form-item>
							<el-form-item label="用户公钥：">{{ item.publicKey }}</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="用户名称：">{{ item.username }}</el-form-item>
							<el-form-item label="IP地址：">{{ item.ipAddress }}</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
		</el-card>
	</div>
</template>
<script setup lang="ts" name="sMPC">
import { reactive, onMounted } from 'vue';
import { getNetworkList } from '@/api/thresholdKey/sMPC';
import { ElMessage } from 'element-plus';

const state = reactive<sMPCType>({
	loading: false,
	tableData: [],
});

const getTableData = () => {
	state.loading = true;
	getNetworkList()
		.then((res) => {
			state.loading = false;
			if (res.resultCode === 0) {
				state.tableData = [];
				state.loading = false;
				state.tableData = res.data;
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			state.loading = false;
			console.error(err);
		});
};

onMounted(() => {
	getTableData();
});
</script>
<style scoped lang="scss">
.title {
	font-size: 24px;
}
</style>
