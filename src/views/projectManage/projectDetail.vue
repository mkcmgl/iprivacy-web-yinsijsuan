<template>
	<div class="home-container layout-pd layout-padding">
		<el-card class="">
			<template #header>
				<div class="card-header">
					<p>基本信息</p>
				</div>
			</template>
			<div class="card-header-flex">
				<div class="w50">
					<div class="flex mg-b-20">
						<p class="w-100">项目名称：</p>
						<p>{{projectDetailMsg.name}}</p>
					</div>
					<div class="flex mg-b-20">
						<p class="w-100">项目描述：</p>
						<p>{{projectDetailMsg.description}}</p>
					</div>
				</div>
				<div class="w50">
					<div class="flex mg-b-20">
						<p class="w-100">项目ID:</p>
						<el-tooltip
							class="box-item"
							effect="dark"
							content="qpvgk4jzrwm72rbdx164bw5fd5bf1q5bmnnujj9upm1rvh71k4gwsp5gur6ca"
							placement="top"
						>
							<p class="word-break detail-text-width text-overflow-nowarp">
								{{projectDetailMsg.id  }}
							</p>
						</el-tooltip>
					</div>
					<div class="flex mg-b-20">
						<p class="w-100">创建时间：</p>
						<p class="word-break">{{projectDetailMsg.createTime}}</p>
					</div>
				</div>
			</div>
			<!-- <div>
                <span>数据表结构：</span>
                <el-table :data="tableData" border style="width: 50%">
                    <el-table-column prop="date" label="Date" width="180" />
                    <el-table-column prop="name" label="Name" width="180" />
                    <el-table-column prop="address" label="Address" />
                </el-table>
            </div>

            <template #footer>Footer content</template> -->
		</el-card>
		<el-card class="mg-t-20">
			<template #header>
				<div class="card-header">
					<p>协同信息</p>
				</div>
			</template>
			<div>
				<el-tabs type="border-card">
					<el-tab-pane label="发起机构">
						<div>
							<div class="mg-b-10">工业互联网股份有限公司</div>
							<el-button type="primary" class="mg-b-10">添加数据到此项目</el-button>
							<el-table :data="tableData">
								<el-table-column label="数据集ID" prop="dataId"></el-table-column>
								<el-table-column label="数据名称"></el-table-column>
								<el-table-column label="数据条数"></el-table-column>
								<el-table-column label="数据格式"></el-table-column>
								<el-table-column label="操作" width="100">
									<template #default="scope">
										<el-button size="small" text type="primary" v-auth="'api:role:update'">查看</el-button>
										<el-button
											size="small"
											text
											type="primary"
											@click="onRowDel(scope.row, scope.$index)"
											v-auth="'api:role:delete'"
											>删除</el-button
										>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</el-tab-pane>
					<el-tab-pane label="协作机构">
						<div>
							<span class="mg-r-30">浪潮科学研究院有限公司</span>
							<span>审核意见：同意</span>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="projectDetail">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserInfo } from '@/stores/userInfo';
import { projectDetail } from '@/api/projectManage';
import { NodeDetailType, ProjectDetailType } from '@/types/views';
const tableData = [
	{
		dataId: '1',
		date: '2016-05-03',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles',
	},
	{
		dataId: '2',
		date: '2016-05-02',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles',
	},
	{
		dataId: '3',
		date: '2016-05-04',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles',
	},
	{
		dataId: '4',
		date: '2016-05-01',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles',
	},
];
const onRowDel = (e: any, index: any) => {
	console.log(`output->e,index`, e, index);
};
onMounted(() => {
	getNodeDetail();
});
const router = useRouter();
const route = useRoute();
const userInfos = useUserInfo();
const projectDetailMsg = ref(<ProjectDetailType>{});
// const tableData = [];
const getNodeDetail = () => {
	projectDetail({ projectId: route.query.projectId }).then((res) => {
		projectDetailMsg.value = res.data;
		console.log(`output->e,index`, projectDetailMsg.value);
	});
};
</script>

<style scoped lang="scss"></style>
