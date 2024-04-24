<template>
	<div class="enterprise-detail-container layout-padding">
		<el-row v-if="state.form.orgRegisterState != 0">
			<el-col :span="24" class="auditbox">
				<div style="display: flex">
					<div class="state-title">审核状态：</div>
					<div v-if="state.form.auditState == '0'">
						<i class="iconfont icon-yuan1 lamp-tips-blue"></i>
						<span class="lamp-tips">(待审核)</span>
					</div>
					<div v-if="state.form.auditState == '1'">
						<i class="iconfont icon-yuan1 lamp-tips-green"></i>
						<span class="lamp-tips">(已审核)</span>
					</div>
					<div v-if="state.form.auditState == '2'">
						<i class="iconfont icon-yuan1 lamp-tips-red"></i>
						<span class="lamp-tips">(驳回)</span>
					</div>
				</div>
				<el-button v-if="state.form.auditState == '2'" class="button" type="warning" @click="edit" v-auth="'organize:admin:edit'"
					>编辑</el-button
				>
			</el-col>
			<el-col :span="24" class="mb15" v-if="state.form.auditState == '2' && state.form.auditOpinion">
				<span>驳回原因：{{ state.form.auditOpinion }}</span>
			</el-col>
		</el-row>

		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>企业信息</span>
				</div>
			</template>
			<el-row v-if="state.form.orgRegisterState == 0">
				<el-col :span="24" class="flexbox">
					<div style="margin: 50px 0">请提交企业信息进行实名认证</div>
					<el-button class="button" type="warning" @click="toRegister" style="margin-bottom: 30px">实名认证</el-button>
				</el-col>
			</el-row>

			<el-row v-else>
				<el-col :span="24">
					<el-form :model="state.form" label-width="150px">
						<el-form-item label="企业/机构名称">
							<span>{{ state.form.organizeName }}</span>
						</el-form-item>
						<el-form-item label="企业性质">
							<span>{{ state.form.organizeNature ? state.natures[parseInt(state.form.organizeNature) - 1].VALUE : '' }}</span>
						</el-form-item>
						<el-form-item label="证件类型">
							<span>{{
								state.form.organizeCodeType ? state.codeType[parseInt(state.form.organizeCodeType) == 1 ? 0 : 1].VALUE : ''
							}}</span>
						</el-form-item>
						<el-form-item label="证件号">
							<span>{{ state.form.organizeCode }}</span>
						</el-form-item>
						<el-form-item label="营业执照类型">
							<span>{{
								state.form.organizeLicenseType ? state.licenseTypes[parseInt(state.form.organizeLicenseType) - 1].VALUE : ''
							}}</span>
						</el-form-item>
						<el-form-item label="证件照片">
							<el-image
								style="width: 210px; height: 130px; background-color: #eeeeee"
								v-if="state.form.organizeLicenseUrl"
								:src="state.form.organizeLicenseUrl"
								:zoom-rate="1.2"
								:preview-src-list="[state.form.organizeLicenseUrl]"
								fit="contain"
							/>
						</el-form-item>
						<el-form-item label="所在地区">
							<span>{{ state.form.zoneNameAll }}</span>
						</el-form-item>
						<el-form-item label="所在行业">
							<span>{{ state.form.industryCategoryStr }} - {{ state.form.industrySpecificStr }}</span>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-card>
	</div>
</template>
<script lang="ts" setup name="systemEnterpriseInfo">
import { ref, reactive, onMounted, nextTick, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getOrganizeDetail } from '@/api/system/enterpriseinfo';

const router = useRouter();
const auditDialogFormRef = ref();
const state = reactive({
	isOnceMore: false,
	form: {
		orgRegisterState: null,
		auditState: '',
		auditOpinion: '',
		organizeName: '',
		organizeNature: '',
		organizeCodeType: '',
		organizeCode: '',
		organizeLicenseType: '',
		organizeLicenseUrl: '',
		useHanlde: null,
		serverType: null,
		prefix: '',
		url: '',
		appId: '',
		secret: '',
		zoneNameAll: '',
		industryCategoryStr: '',
		industrySpecificStr: '',
	},

	natures: [
		{ VALUE: '国有控股', NAME: '1' },
		{ VALUE: '民营控股', NAME: '2' },
		{ VALUE: '外商控股', NAME: '3' },
		{ VALUE: '事业单位', NAME: '4' },
		{ VALUE: '民营非盈利组织', NAME: '5' },
	],
	// 营业执照
	licenseTypes: [
		{ NAME: '1', VALUE: '营业执照' },
		{ NAME: '2', VALUE: '税务证' },
		{ NAME: '3', VALUE: '组织机构代码证' },
		{ NAME: '4', VALUE: '安全生产许可证' },
		{ NAME: '5', VALUE: '工业产品生产许可证或许可证' },
	],
	codeType: [
		{ NAME: '1', VALUE: '统一社会信用代码' },
		{ NAME: '3', VALUE: '其他' },
	],
	dialogFormVisible: false,
	formLabelWidth: '100px',
	dialogForm: {
		auditState: null,
		auditOpinion: '',
	},
});
const getDetail = () => {
	getOrganizeDetail({})
		.then((res) => {
			if (res.resultCode == 0) {
				state.form = res.data;
				if (state.form.auditState != '1' && state.form.orgRegisterState != 0) {
					ElMessage.warning('企业信息审核未完成');
				}
			} else {
				ElMessage.error(res.resultDesc);
			}
			state.isOnceMore = true;
		})
		.catch((err) => {});
};
const toRegister = () => {
	router.push({
		path: '/system/enterpriseinfo/add',
		query: {
			type: 'add',
		},
	});
};
const edit = () => {
	router.push({
		path: '/system/enterpriseinfo/add',
		query: {
			type: 'edit',
		},
	});
};

// 页面加载时
onMounted(() => {
	getDetail();
});
onActivated(() => {
	if (state.isOnceMore) {
		getDetail();
	}
});
</script>
<style scoped lang="scss">
.auditbox {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20px;
}
.lamp-tips {
	padding-right: 10px;
	font-weight: 600;
	width: 42px;
	vertical-align: bottom;
	margin-left: 5px;
}
.lamp-tips-red {
	color: #ea0004;
}
.lamp-tips-green {
	color: #31b840;
}
.lamp-tips-blue {
	color: #2186fb;
}
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.flexbox {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
