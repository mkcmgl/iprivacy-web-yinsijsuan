<template>
	<div class="enterprise-detail-container layout-padding">
		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>企业信息</span>
					<el-button v-if="state.form.auditState == 0" class="button" type="primary" @click="save">审核</el-button>
				</div>
			</template>
			<el-row>
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

		<el-dialog v-model="state.dialogFormVisible" title="审核">
			<el-form ref="auditDialogFormRef" :model="state.dialogForm">
				<el-form-item label="审核结果" :label-width="state.formLabelWidth" prop="auditState">
					<el-radio-group v-model="state.dialogForm.auditState">
						<el-radio :label="1">通过</el-radio>
						<el-radio :label="2">驳回</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="审核意见" :label-width="state.formLabelWidth" prop="auditOpinion">
					<el-input v-model="state.dialogForm.auditOpinion" :rows="5" type="textarea" maxlength="100" />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="closeDialog">取消</el-button>
					<el-button type="primary" @click="auditSubmit" :loading="state.submitloading"> 提交 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script lang="ts" setup name="systemEnterpriseDetail">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getOrganizeDetail, auditOrganize } from '@/api/system/enterprise';
import other from '@/utils/other';

const router = useRouter();
let organizeId = router.currentRoute.value.query.organizeId;
const auditDialogFormRef = ref();
const state = reactive({
	submitloading: false,
	form: {
		auditState: null,
		organizeName: '',
		organizeNature: '',
		organizeCodeType: '',
		organizeCode: '',
		organizeLicenseType: '',
		organizeLicenseUrl: '',
		useHanlde: null,
		serverType: null,
		prefix: '',
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
	getOrganizeDetail({
		organizeId,
	})
		.then((res) => {
			if (res.resultCode == 0) {
				state.form = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {});
};

const save = () => {
	state.dialogFormVisible = true;
};
const auditSubmit = other.debounce(() => {
	state.submitloading = true;
	auditOrganize({
		organizeId,
		...state.dialogForm,
	})
		.then((res) => {
			if (res.resultCode == 0) {
				state.submitloading = false;
				ElMessage({
					type: 'success',
					message: '审核成功',
				});
				closeDialog();
				router.push({
					path: '/system/enterprise',
					query: {},
				});
			} else {
				state.submitloading = false;
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {
			state.submitloading = false;
		});
}, 3000);
// 关闭弹窗
const closeDialog = () => {
	state.dialogFormVisible = false;
	// 清空表单，此项需加表单验证才能使用
	nextTick(() => {
		auditDialogFormRef.value.resetFields();
	});
};

// 页面加载时
onMounted(() => {
	getDetail();
});
</script>
<style scoped lang="scss">
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
