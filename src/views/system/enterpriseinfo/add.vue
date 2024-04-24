<template>
	<div class="enterprise-detail-container layout-padding">
		<el-form ref="organizeForm" :model="state.form" :rules="rules" label-width="150px">
			<el-card class="box-card">
				<template #header>
					<div class="card-header">
						<span>企业信息</span>
						<el-button class="button" type="primary" @click="toCheck" :loading="state.checkloading">提交审核</el-button>
					</div>
				</template>

				<el-row>
					<el-col :span="24">
						<el-form-item label="企业/机构名称" prop="organizeName">
							<el-input
								v-model="state.form.organizeName"
								:maxlength="64"
								placeholder="请输入"
								style="width: 350px"
								@input="state.form.organizeName = state.form.organizeName.replace(/\s+/g, '')"
							/>
						</el-form-item>
						<el-form-item label="企业性质" prop="organizeNature">
							<el-select :transfer="true" v-model="state.form.organizeNature" style="width: 350px">
								<el-option v-for="items in state.natures" :value="items.NAME" :label="items.VALUE" :key="items.NAME"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="证件类型" prop="organizeCodeType">
							<el-select :transfer="true" v-model="state.form.organizeCodeType" style="width: 350px">
								<el-option v-for="items in state.codeType" :value="items.NAME" :label="items.VALUE" :key="items.NAME"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="证件号" prop="organizeCode">
							<el-input
								v-model="state.form.organizeCode"
								:maxlength="64"
								placeholder="请输入"
								style="width: 350px"
								@input="state.form.organizeCode = state.form.organizeCode.replace(/\s+/g, '')"
							/>
						</el-form-item>
						<el-form-item label="营业执照类型" prop="organizeLicenseType">
							<el-select :transfer="true" v-model="state.form.organizeLicenseType" style="width: 350px">
								<el-option v-for="items in state.licenseTypes" :value="items.NAME" :label="items.VALUE" :key="items.NAME"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="证件照片" prop="organizeLicenseUrl" style="min-width: 790px">
							<div class="yyzz_imgupload_box">
								<image-upload
									@getImageList="getImageList($event)"
									accept=".jpg,.jpeg,.png,.bmp"
									:value="state.imgFileList"
									:fileSize="1"
								></image-upload>
							</div>
							<div class="yyzz_note">
								清晰的图片可以让您更快通过审核;<br />

								推荐上传扫描文件；拍照请尽量降低反光;<br />

								确保营业执照图片所有信息清晰可鉴，内容真实有效，无任何修改;<br />

								文件大小不超过1M，格式支持.jpg .jpeg .png .bmp<br />
							</div>
						</el-form-item>
						<el-form-item label="所在地区" prop="area">
							<div style="width: 350px">
								<area-picker :areaWidth="'100%'" :code="state.form.area" @updateAreaCode="updateAreaCode($event)"></area-picker>
							</div>
						</el-form-item>
						<el-form-item label="所在行业" prop="industrySpecific">
							<div style="width: 350px">
								<industry-picker
									:industryWidth="'100%'"
									:code="state.form.industryList"
									@updateIndustryCode="updateIndustryCode($event)"
								></industry-picker>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
		</el-form>
	</div>
</template>
<script lang="ts" setup name="systemEnterpriseInfo">
import { defineAsyncComponent, ref, reactive, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, FormRules, FormInstance } from 'element-plus';
import type { UploadProps } from 'element-plus';
import { organizeAdd, getOrganizeDetail, organizeUpdate } from '@/api/system/enterpriseinfo';
import { setAjaxUrl } from '@/utils/PlatformName';
const areaPicker = defineAsyncComponent(() => import('@/components/areaPicker/index.vue'));
const industryPicker = defineAsyncComponent(() => import('@/views/system/enterpriseinfo/components/industryPicker/index.vue'));
const imageUpload = defineAsyncComponent(() => import('@/components/ImageUpload/index.vue'));

const router = useRouter();
let type = router.currentRoute.value.query.type;
const state = reactive({
	checkloading: false,
	url: setAjaxUrl(),
	form: {
		organizeName: '',
		organizeNature: '',
		organizeCodeType: '',
		organizeCode: '',
		organizeLicenseType: '',
		organizeLicenseUrl: '',
		address: '',
		useHanlde: 1,
		serverType: 1,
		prefix: '',
		url: '',
		appId: '',
		secret: '',
		province: '',
		city: '',
		area: '',
		industryCategory: '',
		industrySpecific: '',
		industryList: [] as Array<string>,
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
	imgFileList: [] as Array<FileListType>,
});
const organizeForm = ref<FormInstance>();
const rules = reactive<FormRules>({
	organizeName: [
		{ required: true, message: '请输入企业/机构名称', trigger: 'blur' },
		{ min: 1, max: 64, message: '企业/机构名称长度必须在1-64之间', trigger: 'blur' },
	],
	organizeNature: [{ required: true, message: '请选择企业性质', trigger: 'change' }],
	organizeCodeType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
	organizeCode: [
		{ required: true, message: '请输入证件号', trigger: 'blur' },
		{ min: 1, max: 18, message: '证件号长度必须在1-18之间', trigger: 'blur' },
	],
	organizeLicenseType: [{ required: true, message: '请选择营业执照类型', trigger: 'change' }],
	organizeLicenseUrl: [{ required: true, message: '请选择证件照片', trigger: 'blur' }],
	area: [{ required: true, message: '请选择所在地区', trigger: 'change' }],
	industrySpecific: [{ required: true, message: '请选择所在行业', trigger: 'change' }],
	useHanlde: [{ required: true, message: '请选择是否使用标识解析', type: 'number', trigger: 'blur' }],
	serverType: [{ required: true, message: '请选择标识解析对接模式', trigger: 'blur' }],
	url: [{ required: true, message: '请输入域名', trigger: 'blur' }],
	prefix: [{ required: true, message: '请输入前缀', trigger: 'blur' }],
	appId: [{ required: true, message: '请输入APPID/帐号', trigger: 'blur' }],
	secret: [{ required: true, message: '请输入APP SECRET/密码', trigger: 'blur' }],
});
const getDetail = () => {
	getOrganizeDetail({})
		.then((res) => {
			if (res.resultCode == 0) {
				state.form = res.data;
				state.form.industryList = [state.form.industryCategory, state.form.industrySpecific];
				if (state.form.organizeLicenseUrl) {
					state.imgFileList = [
						{
							name: '',
							url: state.form.organizeLicenseUrl,
						},
					];
				}
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {});
};

const toCheck = () => {
	organizeForm.value?.validate((valid) => {
		if (valid) {
			state.checkloading = true;
			if (type == 'add') {
				organizeAdd({
					...state.form,
				})
					.then((res) => {
						if (res.resultCode == 0) {
							state.checkloading = false;
							ElMessage({
								type: 'success',
								message: '提交成功',
							});
							router.push({
								path: '/system/enterpriseinfo',
								query: {},
							});
						} else {
							state.checkloading = false;
							ElMessage.error(res.resultDesc);
						}
					})
					.catch((err) => {
						state.checkloading = false;
					});
			} else if (type == 'edit') {
				organizeUpdate({
					...state.form,
				})
					.then((res) => {
						if (res.resultCode == 0) {
							state.checkloading = false;
							ElMessage({
								type: 'success',
								message: '编辑成功',
							});
							router.push({
								path: '/system/enterpriseinfo',
								query: {},
							});
						} else {
							state.checkloading = false;
							ElMessage.error(res.resultDesc);
						}
					})
					.catch((err) => {
						state.checkloading = false;
					});
			}
		}
	});
};

const updateAreaCode = (code: AreaCodeType) => {
	state.form.province = code.province;
	state.form.city = code.city;
	state.form.area = code.area;
};

const updateIndustryCode = (code: IndustryCodeType) => {
	state.form.industryCategory = code.industryCategory;
	state.form.industrySpecific = code.industrySpecific;
};

const getImageList = (file: Array<FileListType>) => {
	if (file.length == 0) {
		state.form.organizeLicenseUrl = '';
	} else {
		state.form.organizeLicenseUrl = file[0].url;
	}
};

// 页面加载时
onMounted(() => {
	if (type == 'edit') {
		getDetail();
	}
});
</script>
<style scoped lang="scss">
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

.yyzz_note {
	display: inline-block;
	font-size: 14px;
	line-height: 2;
	vertical-align: middle;
	margin-left: 20px;
}
</style>
