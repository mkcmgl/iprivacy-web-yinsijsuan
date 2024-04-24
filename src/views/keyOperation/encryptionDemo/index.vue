<template>
	<div class="encryption-demo-container layout-padding">
		<el-card shadow="never" class="mt20 mb20">
			<el-tabs v-model="state.secretType" class="demo-tabs" @tab-change="handleChange">
				<el-tab-pane label="SM2" name="2">
					<el-form :model="state.form" label-width="100px" :inline="false" size="large">
						<el-form-item label="他人证书">
							<div>
								<base64-file-upload :accept="'.cer'" @getFile="getFile" style="display: inline"></base64-file-upload>
								<div class="mt10">{{ state.form.fileName }}</div>
							</div>
						</el-form-item>
						<el-form-item label="他人证书内容">
							<el-input v-model="state.form.certificateInfo" type="textarea" readonly :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="明文">
							<el-input v-model="state.form.context" placeholder="请输入明文" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:demonstrate:encrypt'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" :loading="state.encipherLoading" @click="encipher()">加密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="密文">
							<el-input v-model="state.form.ciphertext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="copyCiphertext">复制密文</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="SM4" name="4">
					<el-form :model="state.form" label-width="100px" :inline="false" size="large">
						<el-form-item label="明文">
							<el-input v-model="state.form.context" placeholder="请输入明文" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="密钥">
							<el-input v-model="state.form.secret" placeholder="请输入密钥"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:demonstrate:encrypt'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" :loading="state.encipherLoading" @click="encipher()">加密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="密文">
							<el-input v-model="state.form.ciphertext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" :loading="state.encipherLoading" @click="copyCiphertext">复制密文</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="SM3" name="3">
					<el-form :model="state.form" label-width="100px" :inline="false" size="large">
						<el-alert title="注：SM3加密是一种不可逆的加密算法" type="success" :closable="false" class="mb20" />
						<el-form-item label="明文">
							<el-input v-model="state.form.context" placeholder="请输入明文" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:demonstrate:encrypt'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="encipher()">加密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="密文">
							<el-input v-model="state.form.ciphertext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="copyCiphertext">复制密文</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="SM9" name="9">
					<el-form :model="state.form" label-width="140px" :inline="false" size="large">
						<el-form-item label="系统参数">
							<el-input v-model="systemParams.systemParam" readonly></el-input>
						</el-form-item>
						<el-form-item label="社会统一信用代码">
							<el-input v-model="systemParams.organizeCode" readonly></el-input>
						</el-form-item>
						<el-form-item label="加密主公钥">
							<el-input v-model="systemParams.encryptMasterPublicKey" readonly></el-input>
						</el-form-item>
						<el-form-item label="标识">
							<el-input v-model="state.form.idType" placeholder="请输入标识"></el-input>
						</el-form-item>
						<el-form-item label="明文">
							<el-input v-model="state.form.context" placeholder="请输入明文" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:demonstrate:encrypt'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" :loading="state.encipherLoading" @click="encipher()">加密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="密文">
							<el-input v-model="state.form.ciphertext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="copyCiphertext">复制密文</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="ZUC" name="ZUC">
					<el-form ref="ZUCFormRef" :model="state.form" :rules="ZUCRules" label-width="100px" :inline="false" size="large">
						<el-form-item label="明文">
							<el-input v-model="state.form.context" placeholder="请输入明文" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="密钥" prop="publicKey">
							<el-input v-model="state.form.publicKey" placeholder="请输入密钥" maxlength="16"></el-input>
						</el-form-item>
						<el-form-item label="向量" prop="vector">
							<el-input v-model="state.form.vector" placeholder="请输入向量" maxlength="16"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:zuc:encrypt'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" :loading="state.encipherLoading" @click="ZUCEncipher()">加密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="密文">
							<el-input v-model="state.form.ciphertext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" :loading="state.encipherLoading" @click="copyCiphertext">复制密文</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="门限密钥" name="门限密钥">
					<el-form ref="thresholdKeyFormRef" :model="state.form" :rules="rules" label-width="100px" :inline="false" size="large">
						<el-form-item label="明文">
							<el-input v-model="state.form.context" placeholder="请输入明文" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="加密公钥" prop="publicKey">
							<el-input v-model="state.form.publicKey" placeholder="请输入加密公钥" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:threshold:encrypt'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" :loading="state.encipherLoading" @click="thresholdEncipher()">加密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="密文">
							<el-input v-model="state.form.ciphertext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" :loading="state.encipherLoading" @click="copyCiphertext">复制密文</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="AES" name="1">
					<el-form :model="state.form" label-width="100px" :inline="false" size="large">
						<el-form-item label="明文">
							<el-input v-model="state.form.context" placeholder="请输入明文" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item label="自定义密码">
							<el-input v-model="state.form.secret" placeholder="请输入自定义密码，例如：123456"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:demonstrate:encrypt'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" :loading="state.encipherLoading" @click="encipher()">加密</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="密文">
							<el-input v-model="state.form.ciphertext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" :loading="state.encipherLoading" @click="copyCiphertext">复制密文</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="MD5" name="5">
					<el-form :model="state.form" label-width="100px" :inline="false" size="large">
						<el-alert title="注：MD5加密是一种不可逆的加密算法" type="success" :closable="false" class="mb20" />
						<el-form-item label="明文">
							<el-input v-model="state.form.context" placeholder="请输入明文" type="textarea" :rows="5"></el-input>
						</el-form-item>
						<el-form-item v-auth="'api:cipher:demonstrate:encrypt'">
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="encipher(0)">MD5加密(32位大写)</el-button>
								<el-button type="primary" @click="encipher(1)">MD5加密(32位小写)</el-button>
								<el-button type="primary" @click="encipher(2)">MD5加密(16位大写)</el-button>
								<el-button type="primary" @click="encipher(3)">MD5加密(16位小写)</el-button>
							</div>
						</el-form-item>
						<el-divider border-style="dotted" />
						<el-form-item label="密文">
							<el-input v-model="state.form.ciphertext" type="textarea" :rows="5" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%; text-align: right">
								<el-button type="primary" @click="copyCiphertext">复制密文</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>
<script lang="ts" setup name="encryptionDemo">
import { ElLoading, ElMessage, FormInstance, FormRules, TabPaneName } from 'element-plus';
import { reactive, defineAsyncComponent, ref } from 'vue';
import commonFunction from '@/utils/commonFunction';
import { encrypt, readCer, encryptThreshold, verifyPublicKey, encryptZUC } from '@/api/keyOperation/encryptionDemo';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';

// 引入组件
const Base64FileUpload = defineAsyncComponent(() => import('@/components/Base64FileUpload/index.vue'));

const stores = useUserInfo();
const { systemParams } = storeToRefs(stores);

const thresholdKeyFormRef = ref<FormInstance>();
const ZUCFormRef = ref<FormInstance>();

const state = reactive({
	secretType: '2',
	loading: '' as any,
	encipherLoading: false,
	form: {
		handle: '',
		idType: '',
		context: '',
		secret: '',
		ciphertext: '',
		certificateInfo: '',
		fileName: '',
		file: '',
		publicKey: '',
		vector: '',
	},
});

const checkPublicKey = (rule: any, value: any, callback: any) => {
	if (!value) {
		callback(new Error('请输入加密公钥'));
	}

	verifyPublicKey({
		publicKey: value,
	})
		.then((res) => {
			if (res.resultCode === 0) {
				if (res.data === 1) {
					callback();
				} else {
					callback(new Error('加密公钥不存在，请重新输入'));
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

const ZUCRules = reactive<FormRules>({
	publicKey: [{ required: true, type: 'string', max: 16, min: 16, message: '密钥长度为16位', trigger: 'blur' }],
	vector: [{ required: true, type: 'string', max: 16, min: 16, message: '向量长度为16位', trigger: 'blur' }],
});

const handleChange = (name: TabPaneName) => {
	thresholdKeyFormRef.value?.resetFields();
	ZUCFormRef.value?.resetFields();
	thresholdKeyFormRef.value?.clearValidate();
	ZUCFormRef.value?.clearValidate();
	state.secretType = name as unknown as string;
	state.form = {
		context: '',
		secret: '',
		ciphertext: '',
		certificateInfo: '',
		fileName: '',
		file: '',
		handle: '',
		idType: '',
		publicKey: '',
		vector: '',
	};
};

const getFile = (fileObj: Base64FileType) => {
	state.loading = ElLoading.service({
		text: '正在解析文件',
	});
	state.form.fileName = fileObj.fileName;
	state.form.file = fileObj.file;
	readCer({
		secret: fileObj.file.replace(/^data:application\/x-x509-ca-cert;base64,/, ''),
	})
		.then((res) => {
			state.loading?.close();
			if (res.resultCode === 0) {
				ElMessage.success('解析成功');
				state.form.certificateInfo = res.data;
			} else {
				ElMessage.warning('解析失败');
			}
		})
		.catch((err) => {
			state.loading?.close();
			console.error(err);
		});
};

const encipher = (MD5Type?: number) => {
	if (!state.form.context) {
		ElMessage.warning('请输入明文');
		return;
	}
	switch (state.secretType) {
		case '1':
			if (!state.form.secret) {
				ElMessage.warning('请输入自定义密码');
				return;
			}
			break;

		case '2':
			if (!state.form.file) {
				ElMessage.warning('请上传证书');
				return;
			}
			break;
		case '4':
			if (!state.form.secret) {
				ElMessage.warning('请输入密钥');
				return;
			}
			break;
		case '9':
			if (!systemParams.value.systemParam) {
				ElMessage.warning('请获取系统参数');
				return;
			}
			if (!systemParams.value.organizeCode) {
				ElMessage.warning('请获取社会统一信用代码');
				return;
			}
			if (!systemParams.value.organizeCode) {
				ElMessage.warning('请获取加密主公钥');
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
	state.encipherLoading = true;
	encrypt({
		secretType: state.secretType,
		context: state.form.context,
		secret: state.secretType === '2' ? state.form.file.replace(/^data:application\/x-x509-ca-cert;base64,/, '') : state.form.secret,
		md5Type: MD5Type,
		encryptMasterPublicKey: systemParams.value.encryptMasterPublicKey,
		idType: state.form.idType,
	})
		.then((res) => {
			state.encipherLoading = false;
			if (res.resultCode === 0) {
				state.form.ciphertext = res.data;
			} else {
				state.form.ciphertext = '';
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			state.encipherLoading = false;
			state.form.ciphertext = '';
			console.error(err);
		});
};

const thresholdEncipher = () => {
	if (!state.form.context) {
		ElMessage.warning('请输入明文');
		return false;
	}
	if (!state.form.publicKey) {
		ElMessage.warning('请输入加密公钥');
		return false;
	}

	thresholdKeyFormRef.value?.validate((valid) => {
		state.encipherLoading = true;
		if (valid) {
			encryptThreshold({
				publicKey: state.form.publicKey,
				content: state.form.context,
			})
				.then((res) => {
					state.encipherLoading = false;
					if (res.resultCode === 0) {
						state.form.ciphertext = res.data;
					} else {
						state.form.ciphertext = '';
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => {
					state.encipherLoading = false;
					state.form.ciphertext = '';
					console.error(err);
				});
		} else {
			state.encipherLoading = false;
		}
	});
};

const ZUCEncipher = () => {
	ZUCFormRef.value?.validate((valid) => {
		if (valid) {
			state.encipherLoading = true;
			encryptZUC({
				publicKey: state.form.publicKey,
				content: state.form.context,
				vector: state.form.vector,
			})
				.then((res) => {
					state.encipherLoading = false;
					if (res.resultCode === 0) {
						state.form.ciphertext = res.data;
					} else {
						state.form.ciphertext = '';
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => {
					state.encipherLoading = false;
					state.form.ciphertext = '';
					console.error(err);
				});
		}
	});
};

const copyCiphertext = () => {
	if (state.form.ciphertext) commonFunction().copyText(state.form.ciphertext);
};
</script>
<style lang="scss" scoped>
:deep(.el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label:before) {
	display: none;
}
</style>
