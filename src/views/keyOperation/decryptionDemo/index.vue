<template>
	<div class="decryption-demo-container layout-padding">
		<el-card shadow="never" class="mt20 mb20">
			<el-tabs v-model="state.secretType" class="demo-tabs" @tab-change="handleChange">
				<el-tab-pane label="SM2" name="2">
					<el-form :model="state.form" label-width="100px" :inline="false" size="large">
						<el-form-item label="私钥">
							<div>
								<base64-file-upload :accept="'.pfx,.key'" @getFile="getFile" style="display: inline"></base64-file-upload>
								<div class="mt10">{{ state.form.fileName }}</div>
							</div>
						</el-form-item>
						<el-form-item label="密文">
							<el-input v-model="state.form.context" placeholder="请输入密文" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:demonstrate:decrypt'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="decipher()" size="large" :loading="state.decipherLoading">解密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="明文">
							<el-input v-model="state.form.ciphertext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="copyCiphertext" size="large">复制明文</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="SM4" name="4">
					<el-form :model="state.form" label-width="100px" :inline="false" size="large">
						<el-form-item label="密文">
							<el-input v-model="state.form.context" placeholder="请输入密文" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="密钥">
							<el-input v-model="state.form.secret" placeholder="请输入密钥"></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="decipher()" size="large" :loading="state.decipherLoading">解密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="明文">
							<el-input v-model="state.form.ciphertext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="copyCiphertext" size="large">复制明文</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="SM9" name="9">
					<el-form :model="state.form" label-width="100px" :inline="false" size="large">
						<el-form-item label="系统参数">
							<el-input v-model="systemParams.systemParam" readonly></el-input>
						</el-form-item>
						<el-form-item label="解密标识密钥">
							<el-input v-model="state.form.encryptPrivateKey" placeholder="请输入解密标识密钥" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="加密主公钥">
							<el-input v-model="state.form.encryptMasterPublicKey" placeholder="请输入加密主公钥" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="标识">
							<el-input v-model="state.form.idType" placeholder="请输入标识"></el-input>
						</el-form-item>

						<el-form-item label="密文">
							<el-input v-model="state.form.context" placeholder="请输入密文" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:demonstrate:decrypt'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="decipher()" size="large" :loading="state.decipherLoading">解密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="明文">
							<el-input v-model="state.form.ciphertext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="copyCiphertext" size="large">复制明文</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="ZUC" name="ZUC">
					<el-form ref="ZUCFormRef" :model="state.form" :rules="ZUCRules" label-width="100px" :inline="false" size="large">
						<el-form-item label="密文">
							<el-input v-model="state.form.context" placeholder="请输入密文" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="密钥" prop="publicKey">
							<el-input v-model="state.form.publicKey" placeholder="请输入密钥" maxlength="16"></el-input>
						</el-form-item>
						<el-form-item label="向量" prop="vector">
							<el-input v-model="state.form.vector" placeholder="请输入向量" maxlength="16"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:zuc:decrypt'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="ZUCDecipher()" size="large" :loading="state.decipherLoading">解密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="明文">
							<el-input v-model="state.form.ciphertext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="copyCiphertext" size="large">复制明文</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="门限密钥" name="门限密钥">
					<el-form :model="state.form" label-width="100px" :inline="false" size="large">
						<el-form-item label="密文">
							<el-input v-model="state.form.context" placeholder="请输入密文" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="解密密钥份额">
							<el-select
								placeholder="解密密钥份额"
								v-model="state.form.thresholdValue"
								@change="clearPrivateKeys"
								size="large"
								clearable
							>
								<div v-for="item in 10" :key="item">
									<el-option v-if="item >= 2" :label="item" :value="item"></el-option>
								</div>
							</el-select>
						</el-form-item>
						<div class="mb20" v-for="(item, index) in state.form.thresholdValue" :key="index">
							<el-form-item :label="`私钥份额${item}`">
								<el-input v-model="state.form['privateKeys' + item]" placeholder="请输入私钥" type="textarea" :rows="5"></el-input>
							</el-form-item>
						</div>

						<el-form-item v-auth="'api:cipher:threshold:decrypt'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="thresholdDecipher()" size="large" :loading="state.decipherLoading">解密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="明文">
							<el-input v-model="state.form.ciphertext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="copyCiphertext" size="large">复制明文</el-button>
							</div>
						</el-form-item>
						<img src="../../../assets/thresholdKey/1.png" style="width: 100%" alt="" />
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="AES" name="1">
					<el-form :model="state.form" label-width="100px" :inline="false" size="large">
						<el-form-item label="密文">
							<el-input v-model="state.form.context" placeholder="请输入密文" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="自定义密码">
							<el-input v-model="state.form.secret" placeholder="请输入自定义密码，例如：123456"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:demonstrate:decrypt'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="decipher()" size="large" :loading="state.decipherLoading">解密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="明文">
							<el-input v-model="state.form.ciphertext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="copyCiphertext" size="large">复制明文</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>
		</el-card>

		<el-dialog
			v-model="state.dialogVisible"
			title="证书密码"
			width="769px"
			:show-close="false"
			:close-on-press-escape="false"
			:close-on-click-modal="false"
		>
			<el-form ref="formRef" :model="state.form" label-width="90px" label-position="left" size="large">
				<el-form-item label="密码">
					<el-input placeholder="请输入密码" v-model="state.form.password" size="large" clearable></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="onSubmit" size="large">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script lang="ts" setup name="decryptionDemo">
import { ElLoading, ElMessage, FormInstance, FormRules, TabPaneName } from 'element-plus';
import { reactive, ref, defineAsyncComponent } from 'vue';
import commonFunction from '@/utils/commonFunction';
import { decrypt, decryptThreshold, decryptZUC } from '@/api/keyOperation/decryptionDemo';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';

// 引入组件
const Base64FileUpload = defineAsyncComponent(() => import('@/components/Base64FileUpload/index.vue'));

const stores = useUserInfo();
const { systemParams } = storeToRefs(stores);

const state = reactive({
	secretType: '2',
	loading: '' as any,
	decipherLoading: false,
	form: {
		context: '',
		secret: '',
		ciphertext: '',
		certificateInfo: '',
		fileName: '',
		file: '',
		password: '',
		fileType: '',
		encryptPrivateKey: '',
		encryptMasterPublicKey: '',
		idType: '',
		privateKeys: '',
		publicKey: '',
		vector: '',
		thresholdValue: '' as unknown as number,
	},
	dialogVisible: false,
});

const formRef = ref<FormInstance>();
const ZUCFormRef = ref<FormInstance>();

const handleChange = (name: TabPaneName) => {
	state.secretType = name as unknown as string;
	state.form = {
		context: '',
		secret: '',
		ciphertext: '',
		certificateInfo: '',
		fileName: '',
		file: '',
		password: '',
		fileType: '',
		encryptPrivateKey: '',
		encryptMasterPublicKey: '',
		idType: '',
		privateKeys: '',
		publicKey: '',
		vector: '',
		thresholdValue: '' as unknown as number,
	};
	for (let i = 1; i <= 9; i++) {
		state.form['privateKeys' + i] = '';
	}
	ZUCFormRef.value?.resetFields();
	ZUCFormRef.value?.clearValidate();
};

const ZUCRules = reactive<FormRules>({
	publicKey: [{ required: true, type: 'string', max: 16, min: 16, message: '密钥长度为16位', trigger: 'blur' }],
	vector: [{ required: true, type: 'string', max: 16, min: 16, message: '向量长度为16位', trigger: 'blur' }],
});

const getFile = (fileObj: Base64FileType) => {
	state.form.fileName = fileObj.fileName;
	state.form.file = fileObj.file;
	state.form.fileType = fileObj.fileType;
	state.form.password = '';
	if (state.form.fileType === 'application/x-pkcs12') {
		formRef.value?.clearValidate();
		state.dialogVisible = true;
	}
};

const onSubmit = () => {
	state.dialogVisible = false;
};

const decipher = () => {
	switch (state.secretType) {
		case '2':
			if (!state.form.file) {
				ElMessage.warning('请上传证书');
				return;
			}
			break;
		case '4':
			if (!state.form.context) {
				ElMessage.warning('请输入密文');
				return;
			}
			if (!state.form.secret) {
				ElMessage.warning('请输入密钥');
				return;
			}
			break;
		case '9':
			if (!state.form.context) {
				ElMessage.warning('请输入密文');
				return;
			}
			if (!state.form.encryptPrivateKey) {
				ElMessage.warning('请输入解密标识密钥');
				return;
			}
			if (!state.form.encryptMasterPublicKey) {
				ElMessage.warning('请输入加密主公钥');
				return;
			}
			if (!state.form.idType) {
				ElMessage.warning('请输入标识');
				return;
			}
			break;
		default:
			break;
	}
	state.decipherLoading = true;
	decrypt({
		secretType: state.secretType,
		context: state.form.context,
		secret: state.secretType === '2' ? state.form.file.replace(/^data:application\/(x-pkcs12|octet-stream);base64,/, '') : state.form.secret,
		password: state.form.password,
		encryptPrivateKey: state.form.encryptPrivateKey,
		encryptMasterPublicKey: state.form.encryptMasterPublicKey,
		idType: state.form.idType,
	})
		.then((res) => {
			state.decipherLoading = false;
			if (res.resultCode === 0) {
				state.form.ciphertext = res.data;
			} else {
				state.form.ciphertext = '';
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			state.decipherLoading = false;
			state.form.ciphertext = '';
			console.error(err);
		});
};

const thresholdDecipher = () => {
	if (!state.form.context) {
		ElMessage.warning('请输入密文');
		return false;
	}

	let arr = [];

	for (let i = 1; i <= state.form.thresholdValue; i++) {
		if (!state.form['privateKeys' + i]) {
			ElMessage.warning('请输入私钥' + i);
			return false;
		}
		arr.push(state.form['privateKeys' + i]);
	}

	state.decipherLoading = true;

	decryptThreshold({
		content: state.form.context,
		privateKeys: arr.join(';'),
	})
		.then((res) => {
			state.decipherLoading = false;
			if (res.resultCode === 0) {
				state.form.ciphertext = res.data;
			} else {
				state.form.ciphertext = '';
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			state.decipherLoading = false;
			state.form.ciphertext = '';
			console.error(err);
		});
};

const ZUCDecipher = () => {
	ZUCFormRef.value?.validate((valid) => {
		if (valid) {
			state.decipherLoading = true;
			decryptZUC({
				publicKey: state.form.publicKey,
				content: state.form.context,
				vector: state.form.vector,
			})
				.then((res) => {
					state.decipherLoading = false;
					if (res.resultCode === 0) {
						state.form.ciphertext = res.data;
					} else {
						state.form.ciphertext = '';
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => {
					state.decipherLoading = false;
					state.form.ciphertext = '';
					console.error(err);
				});
		}
	});
};

const clearPrivateKeys = () => {
	state.form.privateKeys = '';
	for (let i = 1; i <= 9; i++) {
		state.form['privateKeys' + i] = '';
	}
};

const copyCiphertext = () => {
	if (state.form.ciphertext) commonFunction().copyText(state.form.ciphertext);
};
</script>
<style lang="scss" scoped>
:deep(.el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label:before) {
	display: none;
}
.decryption-demo-container {
	.el-select,
	.el-select-v2 {
		width: 100%;
	}

	.el-select .el-input {
		width: 100%;
	}
}
</style>
