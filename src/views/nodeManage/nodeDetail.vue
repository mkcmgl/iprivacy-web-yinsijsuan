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
						<p>{{ nodeDetailMsg.nodeName }}</p>
					</div>
					<div class="flex mg-b-20">
						<p class="w-100">端口:</p>
						<p>{{ nodeDetailMsg.nodePort }}</p>
					</div>
					<div class="flex mg-b-20">
						<p class="w-100">激活状态：</p>
						<el-switch
							size="default"
							:active-value="1"
							:inactive-value="0"
							disabled
							v-model="nodeDetailMsg.activationStatus"
						/>
					</div>
					<div class="flex mg-b-20">
						<p class="w-100">创建时间：</p>
						<p>{{ nodeDetailMsg.createTime }}</p>
					</div>
				</div>
				<div class="w50">
					<div class="flex mg-b-20">
						<p class="w-100">节点ID：</p>
						<p class="word-break detail-text-width">{{ nodeDetailMsg.nodeId }}</p>
					</div>
					<div class="flex mg-b-20">
						<p class="w-100">IP:</p>
						<p class="w-100">{{ nodeDetailMsg.nodeIp }}</p>
					</div>
					<div class="flex mg-b-20">
						<p class="w-100">在线状态：</p>
						<div class="align-center">
									<div
										class="mg-r-2"
										:class="{
											'round-green': nodeDetailMsg.onlineStatus == '1',
											'round-red': nodeDetailMsg.onlineStatus == '0',
										}"
									/>
									<div>{{ nodeDetailMsg.onlineStatus == '0' ? '离线' : '在线' }}</div>
								</div>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="nodeDetail">
import {  onMounted, ref, } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserInfo } from '@/stores/userInfo';
import { nodeDetail } from '@/api/nodeManage';
import { NodeDetailType } from '@/types/views';

const router = useRouter();
const route = useRoute();
const userInfos = useUserInfo();
const nodeDetailMsg = ref(<NodeDetailType>{});
const tableData = [];

onMounted(() => {
	getNodeDetail();
});
const getNodeDetail = () => {
	nodeDetail({ nodeId: route.query.nodeId }).then((res) => {
		nodeDetailMsg.value = res.data;
	});
};
</script>

<style scoped lang="scss"></style>
