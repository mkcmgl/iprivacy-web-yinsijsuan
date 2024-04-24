<template>
	<div class="digital-signature-demo-container layout-padding">
		<el-card shadow="never" class="mt20 mb20">
			<el-tabs v-model="state.secretType" class="demo-tabs" @tab-change="handleChange">
				<el-tab-pane label="SM9" name="9">
					<el-form :model="state.form" label-width="130px" :inline="false" size="large">
						<el-form-item label="系统参数">
							<el-input v-model="systemParams.systemParam" readonly></el-input>
						</el-form-item>
						<el-form-item label="社会统一信用代码">
							<el-input v-model="systemParams.organizeCode" readonly></el-input>
						</el-form-item>
						<el-form-item label="签名主公钥">
							<el-input v-model="systemParams.signMasterPublicKey" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item label="签名标识密钥">
							<el-input v-model="state.form.signMasterPrivateKey" placeholder="请输入签名标识密钥" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="标识">
							<el-input v-model="state.form.idType" placeholder="请输入标识"></el-input>
						</el-form-item>
						<el-form-item label="签名内容">
							<el-input v-model="state.form.context" placeholder="请输入签名内容" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:demonstrate:sign'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="encipher()" :loading="state.loading">加密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="签名结果">
							<el-input v-model="state.form.signtext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="copyCiphertext">复制签名</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="ZUC" name="ZUC">
					<el-form ref="ZUCFormRef" :model="state.form" :rules="ZUCRules" label-width="100px" :inline="false" size="large">
						<el-form-item label="签名内容">
							<el-input v-model="state.form.context" placeholder="请输入签名内容" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="密钥" prop="publicKey">
							<el-input v-model="state.form.publicKey" placeholder="请输入密钥" maxlength="16"></el-input>
						</el-form-item>
						<el-form-item label="向量" prop="vector">
							<el-input v-model="state.form.vector" placeholder="请输入向量" maxlength="16"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:zuc:sign'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="ZUCEncipher()" :loading="state.loading">加密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="签名结果">
							<el-input v-model="state.form.signtext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="copyCiphertext">复制签名</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="门限密钥" name="门限密钥">
					<el-form :model="state.form" label-width="100px" :inline="false" size="large">
						<el-form-item label="签名内容">
							<el-input v-model="state.form.context" placeholder="请输入签名内容" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="签名密钥">
							<el-select-v2 v-model="state.form.id" filterable :options="state.signKeyList" placeholder="请选择签名密钥" size="large" />
						</el-form-item>
						<el-form-item v-auth="'api:cipher:threshold:sign'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="thresholdEncipher()" :loading="state.loading">加密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="签名结果">
							<el-input v-model="state.form.signtext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="copyCiphertext">复制签名</el-button>
							</div>
						</el-form-item>
						<img src="../../../assets/thresholdKey/4.png" style="width: 100%" alt="" />
					</el-form>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>
<script lang="ts" setup name="digitalSignatureDemo">
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import commonFunction from '@/utils/commonFunction';
import { demonstrateSign, signThreshold, getListWithoutPage, signZUC } from '@/api/keyOperation/digitalSignatureDemo';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';
const stores = useUserInfo();
const { systemParams } = storeToRefs(stores);

const state = reactive({
	secretType: '9',
	loading: false,
	form: {
		context: '',
		signMasterPrivateKey: '',
		signtext: '',
		idType: '',
		id: '',
		publicKey: '',
		vector: '',
	},
	dialogVisible: false,
	signKeyList: [] as Array<signKeyListType>,
});

const ZUCFormRef = ref<FormInstance>();

const ZUCRules = reactive<FormRules>({
	publicKey: [{ required: true, type: 'string', max: 16, min: 16, message: '密钥长度为16位', trigger: 'blur' }],
	vector: [{ required: true, type: 'string', max: 16, min: 16, message: '向量长度为16位', trigger: 'blur' }],
});

const handleChange = () => {
	state.form = {
		context: '',
		signMasterPrivateKey: '',
		signtext: '',
		idType: '',
		id: '',
		publicKey: '',
		vector: '',
	};
	ZUCFormRef.value?.resetFields();
	ZUCFormRef.value?.clearValidate();
};

const encipher = () => {
	switch (state.secretType) {
		case '9':
			if (!state.form.context) {
				ElMessage.warning('请输入签名内容');
				return;
			}
			if (!state.form.signMasterPrivateKey) {
				ElMessage.warning('请输入签名标识密钥');
				return;
			}
			break;
		default:
			break;
	}
	state.loading = true;
	demonstrateSign({
		secretType: state.secretType,
		context: state.form.context,
		signMasterPublicKey: systemParams.value.signMasterPublicKey,
		signMasterPrivateKey: state.form.signMasterPrivateKey,
		idType: state.form.idType,
	})
		.then((res) => {
			state.loading = false;
			if (res.resultCode === 0) {
				state.form.signtext = res.data;
			} else {
				state.form.signtext = '';
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			state.loading = false;
			state.form.signtext = '';
			console.error(err);
		});
};

const thresholdEncipher = () => {
	state.loading = true;
	signThreshold({
		content: state.form.context,
		id: state.form.id,
	})
		.then((res) => {
			state.loading = false;
			if (res.resultCode === 0) {
				state.form.signtext = res.data;
			} else {
				state.form.signtext = '';
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			state.loading = false;
			state.form.signtext = '';
			console.error(err);
		});
};

const getSelectList = () => {
	getListWithoutPage({
		type: 2,
	})
		.then((res) => {
			if (res.resultCode === 0) {
				state.signKeyList = [];
				res.data.forEach((item: { id?: string; name?: string }) => {
					state.signKeyList.push({
						value: item.id,
						label: item.name,
					});
				});
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

const ZUCEncipher = () => {
	ZUCFormRef.value?.validate((valid) => {
		if (valid) {
			state.loading = true;
			signZUC({
				publicKey: state.form.publicKey,
				content: state.form.context,
				vector: state.form.vector,
			})
				.then((res) => {
					state.loading = false;
					if (res.resultCode === 0) {
						state.form.signtext = res.data;
					} else {
						state.form.signtext = '';
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => {
					state.loading = false;
					state.form.signtext = '';
					console.error(err);
				});
		}
	});
};

const copyCiphertext = () => {
	if (state.form.signtext) commonFunction().copyText(state.form.signtext);
};

onMounted(() => {
	getSelectList();
});
</script>
<style lang="scss" scoped>
:deep(.el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label:before) {
	display: none;
}

.digital-signature-demo-container {
	.el-select,
	.el-select-v2 {
		width: 100%;
	}

	.el-select .el-input {
		width: 100%;
	}
}
</style>
