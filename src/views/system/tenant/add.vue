<template>
	<div class="system-tenant-container layout-padding">
		<el-form ref="addTenantForm" :model="state.form" :rules="rules" label-width="150px">
			<el-card class="box-card">
				<template #header>
					<div class="card-header">
						<span>租户信息</span>
						<el-button class="button" type="primary" @click="toSave" :loading="state.saveloading">保存</el-button>
					</div>
				</template>

				<el-row>
					<el-col :span="24">
						<el-form-item label="上级租户" prop="parentId">
							<el-cascader
								:options="state.treeData"
								:props="{ emitPath: false, checkStrictly: true, value: 'id', label: 'tenantName' }"
								placeholder="请选择上级租户"
								clearable
								style="width: 350px"
								v-model="state.form.parentId"
							>
								<template #default="{ node, data }">
									<span>{{ data.tenantName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
						<el-form-item label="租户名称" prop="tenantName">
							<el-input
								v-model="state.form.tenantName"
								:maxlength="100"
								placeholder="请输入"
								style="width: 350px"
								@input="state.form.tenantName = state.form.tenantName.replace(/\s+/g, '')"
							/>
						</el-form-item>
						<el-form-item label="租户域名" prop="domain">
							<el-input
								v-model="state.form.domain"
								:maxlength="64"
								placeholder="请输入"
								style="width: 350px"
								@input="state.form.domain = state.form.domain.replace(/\s+/g, '')"
							/>
						</el-form-item>
						<el-form-item label="租户状态" prop="status">
							<el-radio-group v-model="state.form.status">
								<el-radio label="1" size="large">启用</el-radio>
								<el-radio label="0" size="large">停用</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>

			<el-card class="box-card" style="margin-top: 20px">
				<template #header>
					<div class="card-header">
						<span>应用信息</span>
					</div>
				</template>
				<el-row>
					<el-col :span="24">
						<el-form-item label="应用名称" prop="appName">
							<el-input
								v-model="state.form.appName"
								:maxlength="100"
								placeholder="请输入"
								style="width: 350px"
								@input="state.form.appName = state.form.appName.replace(/\s+/g, '')"
							/>
						</el-form-item>
						<el-form-item label="应用LOGO" prop="appLogo">
							<div class="yyzz_imgupload_box">
								<image-upload @getImageList="getImageList($event)" accept=".jpg,.jpeg,.png,.bmp" :fileSize="1"></image-upload>
								<!-- <el-upload
									ref="ORGANIZE_LICENSE"
									:action="state.url"
									list-type="picture-card"
									:multiple="false"
									:show-file-list="false"
									:on-success="handleAvatarSuccess"
									:before-upload="beforeAvatarUpload"
								>
									<img v-if="state.form.appLogo" :src="state.form.appLogo" />
									<el-icon v-else><Plus /></el-icon>
								</el-upload> -->
							</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>

			<el-card class="box-card" style="margin-top: 20px">
				<template #header>
					<div class="card-header">
						<span>租户管理员信息</span>
					</div>
				</template>
				<el-row>
					<el-col :span="24">
						<el-form-item label="登录账号" prop="loginName">
							<el-input
								v-model="state.form.loginName"
								:maxlength="64"
								placeholder="请输入"
								style="width: 350px"
								@input="state.form.loginName = state.form.loginName.replace(/\s+/g, '')"
							/>
						</el-form-item>
						<el-form-item label="手机号" prop="phone">
							<el-input v-model="state.form.phone" placeholder="请输入" style="width: 350px" />
						</el-form-item>
						<el-form-item label="密码" prop="password">
							<el-input
								type="password"
								autocomplete="new-password"
								v-model="state.form.password"
								placeholder="请输入"
								style="width: 350px"
								show-password
							/>
						</el-form-item>
						<el-form-item label="确认密码" prop="confirmPassword">
							<el-input type="password" v-model="state.form.confirmPassword" placeholder="请输入" style="width: 350px" show-password />
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>

			<el-card class="box-card" style="margin-top: 20px">
				<template #header>
					<div class="card-header">
						<span>区块链配置信息</span>
					</div>
				</template>
				<el-row :gutter="24">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="区块链名称" prop="chainName">
							<el-input v-model="state.form.chainName" :maxlength="20" placeholder="请输入" style="width: 350px" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="区块链url" prop="chainUrl">
							<el-input v-model="state.form.chainUrl" :maxlength="255" placeholder="请输入" style="width: 350px" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="区块链业务id" prop="chainBizTypeId">
							<el-input v-model="state.form.chainBizTypeId" :maxlength="32" placeholder="请输入" style="width: 350px" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="区块链认证id" prop="chainLoginId">
							<el-input v-model="state.form.chainLoginId" :maxlength="32" placeholder="请输入" style="width: 350px" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="区块链登录url" prop="chainTokenUrl">
							<el-input v-model="state.form.chainTokenUrl" :maxlength="255" placeholder="请输入" style="width: 350px" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="区块链认证密码" prop="chainPsw">
							<el-input type="password" v-model="state.form.chainPsw" :maxlength="128" placeholder="请输入" style="width: 350px" show-password />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="区块链详情url" prop="chainDetailUrl">
							<el-input v-model="state.form.chainDetailUrl" :maxlength="255" placeholder="请输入" style="width: 350px" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="区块链通道" prop="chainChannel">
							<el-input v-model="state.form.chainChannel" :maxlength="32" placeholder="请输入" style="width: 350px" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="区块链类型" prop="chainType">
							<el-input v-model="state.form.chainType" :maxlength="6" placeholder="请输入" style="width: 350px" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
		</el-form>
	</div>
</template>
<script lang="ts" setup name="systemTenantAdd">
import { ref, reactive, nextTick, onMounted, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, FormRules, FormInstance } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { UploadProps } from 'element-plus';
import { setAjaxUrl } from '@/utils/PlatformName';
import { deepClone } from '@/utils/other';
import { verifyPasswordPowerful } from '@/utils/toolsValidate';
import { getTenantTreeList, getTenantDetail, saveTenant, updateTenant } from '@/api/system/tenant';
const imageUpload = defineAsyncComponent(() => import('@/components/ImageUpload/index.vue'));

const router = useRouter();

const state = reactive({
	saveloading: false,
	url: setAjaxUrl(),
	form: {
		parentId: '',
		tenantName: '',
		domain: '',
		status: '',
		appName: '',
		appLogo: '',
		loginName: '',
		phone: '',
		password: '',
		confirmPassword: '',
		chainName: '',
		chainUrl: '',
		chainBizTypeId: '',
		chainLoginId: '',
		chainTokenUrl: '',
		chainPsw: '',
		chainDetailUrl: '',
		chainChannel: '',
		chainType: '',
	},
	treeData: [] as RouteItems, // 上级菜单数据
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
});
const addTenantForm = ref<FormInstance>();
const checkPwd = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请输入密码'));
	} else if (!verifyPasswordPowerful(value)) {
		callback(new Error('请输入数字，字母，符号(!@#$%^&)组成的8-20位字符'));
	} else {
		callback();
	}
};
const checkRePwd = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请确认密码'));
	} else if (value !== state.form.password) {
		callback(new Error('两次输入密码不同'));
	} else {
		callback();
	}
};
const rules = reactive<FormRules>({
	parentId: [{ required: true, message: '请选择上级租户', trigger: 'change' }],
	tenantName: [{ required: true, message: '请输入租户名称', trigger: 'blur' }],
	domain: [{ required: true, message: '请输入租户域名', trigger: 'blur' }],
	status: [{ required: true, message: '请选择租户状态', trigger: 'blur' }],
	appName: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
	appLogo: [{ required: true, message: '请选择应用LOGO', trigger: 'blur' }],
	loginName: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
	phone: [
		{ required: true, message: '请输入手机号', trigger: 'blur' },
		{ pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{ validator: checkPwd, trigger: 'blur' },
	],
	confirmPassword: [
		{ required: true, message: '请输入确认密码', trigger: 'blur' },
		{ validator: checkRePwd, trigger: 'change' },
	],
	chainName: [{ required: true, message: '请输入区块链名称', trigger: 'blur' }],
	chainUrl: [{ required: true, message: '请输入区块链url', trigger: 'blur' }],
	chainBizTypeId: [{ required: true, message: '请输入区块链业务id', trigger: 'blur' }],
	chainLoginId: [{ required: true, message: '请输入区块链认证id', trigger: 'blur' }],
	chainTokenUrl: [{ required: true, message: '请输入区块链登录url', trigger: 'blur' }],
	chainPsw: [
		{ required: true, message: '请输入区块链认证密码', trigger: 'blur' },
		{ validator: checkPwd, trigger: 'blur' },
	],
	chainDetailUrl: [{ required: true, message: '请输入区块链详情url', trigger: 'blur' }],
	chainChannel: [{ required: true, message: '请输入区块链通道', trigger: 'blur' }],
	chainType: [{ required: true, message: '请输入区块链类型', trigger: 'blur' }],
});
const getImageList = (file: Array<FileListType>) => {
	if (file.length == 0) {
		state.form.appLogo = '';
	} else {
		state.form.appLogo = file[0].url;
	}
};

const getTreeData = (data?: any) => {
	const arr: any = [];
	data.map((val?: any) => {
		arr.push({ ...val });
		if (val.children) getTreeData(val.children);
	});
	return arr;
};
const getTreeList = () => {
	getTenantTreeList()
		.then((res) => {
			if (res.resultCode == 0) {
				state.treeData = getTreeData(res.data);
			}
		})
		.catch((err) => {});
};

const toSave = () => {
	addTenantForm.value?.validate((valid) => {
		if (valid) {
			state.saveloading = true;
			saveTenant({
				...state.form,
			})
				.then((res) => {
					if (res.resultCode == 0) {
						state.saveloading = false;
						ElMessage({
							type: 'success',
							message: '新增成功',
						});
						router.push({
							path: '/system/tenant',
							query: {},
						});
					} else {
						state.saveloading = false;
						ElMessage.error(res.resultDesc);
					}
				})
				.catch((err) => {
					state.saveloading = false;
				});
		}
	});
};

// 页面加载时
onMounted(() => {
	getTreeList();
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
// :deep .el-select-dropdown__item.selected {
// 	color: #606266;
// }
</style>
