<template>
	<div class="verification-signature-demo-container layout-padding">
		<el-card shadow="never" class="mt20 mb20">
			<el-tabs v-model="state.secretType" class="demo-tabs" @tab-change="handleChange">
				<el-tab-pane label="SM9" name="9">
					<el-form :model="state.form" label-width="100px" :inline="false" size="large">
						<el-form-item label="系统参数">
							<el-input v-model="systemParams.systemParam" readonly></el-input>
						</el-form-item>
						<el-form-item label="签名主公钥">
							<el-input v-model="systemParams.signMasterPublicKey" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item label="标识">
							<el-input v-model="state.form.idType" placeholder="请输入标识"></el-input>
						</el-form-item>
						<el-form-item label="签名结果">
							<el-input v-model="state.form.signData" placeholder="请输入签名结果" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="签名内容">
							<el-input v-model="state.form.context" placeholder="请输入签名内容" type="textarea" :rows="5"></el-input>
						</el-form-item>

						<el-form-item v-auth="'api:cipher:demonstrate:verify'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="verifySignature()" :loading="state.loading">验签</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="验签结果">
							<el-tag class="ml-2" type="success" v-if="state.form.signtext">{{ state.form.signtext }}</el-tag>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="ZUC" name="ZUC">
					<el-form ref="ZUCFormRef" :model="state.form" :rules="ZUCRules" label-width="100px" :inline="false" size="large">
						<el-form-item label="签名内容">
							<el-input v-model="state.form.context" placeholder="请输入签名内容" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="签名结果">
							<el-input v-model="state.form.signData" placeholder="请输入签名结果" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="密钥" prop="publicKey">
							<el-input v-model="state.form.publicKey" placeholder="请输入密钥" maxlength="16" minlength="16"></el-input>
						</el-form-item>
						<el-form-item label="向量" prop="vector">
							<el-input v-model="state.form.vector" placeholder="请输入向量" maxlength="16"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:zuc:verify'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="verifyZUCSignature()" :loading="state.loading">验签</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="验签结果">
							<el-tag class="ml-2" type="success" v-if="state.form.signtext">{{ state.form.signtext }}</el-tag>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="门限密钥" name="门限密钥">
					<el-form ref="thresholdKeyFormRef" :model="state.form" :rules="rules" label-width="100px" :inline="false" size="large">
						<el-form-item label="签名内容">
							<el-input v-model="state.form.context" placeholder="请输入签名内容" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="签名结果">
							<el-input v-model="state.form.signData" placeholder="请输入签名结果" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="验签公钥" prop="publicKey">
							<el-input v-model="state.form.publicKey" placeholder="请输入验签公钥" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:threshold:verify'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="verifyThresholdSignature()" :loading="state.loading">验签</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="验签结果">
							<el-tag class="ml-2" type="success" v-if="state.form.signtext">{{ state.form.signtext }}</el-tag>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>
<script lang="ts" setup name="verificationSignatureDemo">
import { reactive, ref } from 'vue';
import { verifySign, verifyThresholdSign, verifyPublicKey, verifyZUCSign } from '@/api/keyOperation/verificationSignatureDemo';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';
import { ElMessage, FormInstance, FormRules } from 'element-plus';

const stores = useUserInfo();
const { systemParams } = storeToRefs(stores);

const state = reactive({
	secretType: '9',
	loading: false,
	form: {
		idType: '',
		signData: '',
		context: '',
		signtext: '',
		publicKey: '',
		vector: '',
	},
	dialogVisible: false,
});
const ZUCFormRef = ref<FormInstance>();

const ZUCRules = reactive<FormRules>({
	publicKey: [{ required: true, type: 'string', max: 16, min: 16, message: '密钥长度为16位', trigger: 'blur' }],
	vector: [{ required: true, type: 'string', max: 16, min: 16, message: '向量长度为16位', trigger: 'blur' }],
});

const checkPublicKey = (rule: any, value: any, callback: any) => {
	if (!value) {
		callback(new Error('请输入验签公钥'));
	}

	verifyPublicKey({
		publicKey: value,
	})
		.then((res) => {
			if (res.resultCode === 0) {
				if (res.data === 1) {
					callback();
				} else {
					callback(new Error('验签公钥不存在，请重新输入'));
				}
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

const rules = reactive<FormRules>({
	publicKey: [{ validator: checkPublicKey }],
});

const handleChange = () => {
	state.form = {
		idType: '',
		signData: '',
		context: '',
		signtext: '',
		publicKey: '',
		vector: '',
	};
	ZUCFormRef.value?.resetFields();
	ZUCFormRef.value?.clearValidate();
};

const verifySignature = () => {
	state.loading = true;
	verifySign({
		secretType: state.secretType,
		context: state.form.context,
		signMasterPublicKey: systemParams.value.signMasterPublicKey,
		idType: state.form.idType,
		signData: state.form.signData,
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
			state.form.signtext = '';
			state.loading = false;
			console.error(err);
		});
};

const verifyThresholdSignature = () => {
	state.loading = true;
	verifyThresholdSign({
		content: state.form.context,
		publicKey: state.form.publicKey,
		signData: state.form.signData,
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
			state.form.signtext = '';
			state.loading = false;
			console.error(err);
		});
};

const verifyZUCSignature = () => {
	ZUCFormRef.value?.validate((valid) => {
		if (valid) {
			state.loading = true;
			verifyZUCSign({
				publicKey: state.form.publicKey,
				content: state.form.context,
				vector: state.form.vector,
				signData: state.form.signData,
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
					state.form.signtext = '';
					state.loading = false;
					console.error(err);
				});
		}
	});
};
</script>
<style lang="scss" scoped>
:deep(.el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label:before) {
	display: none;
}
</style>
