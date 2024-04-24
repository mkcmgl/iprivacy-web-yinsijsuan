<template>
	<div class="file-upload-container">
		<el-upload
			ref="uploadBase64"
			action
			:accept="accept"
			:limit="limit"
			:show-file-list="false"
			:before-upload="handleBeforeUpload"
			:headers="headers"
			:auto-upload="true"
			:http-request="handleHttpRequest"
			style="width: 350px"
		>
			<el-button plain size="large">证书上传</el-button>
		</el-upload>
	</div>
</template>
<script setup lang="ts" name="fileUpload">
import { reactive, ref } from 'vue';
import type { UploadInstance, UploadProps, UploadRequestOptions } from 'element-plus';
import { ElMessage } from 'element-plus';

const state = reactive({
	fileName: '',
});

const props = defineProps({
	accept: {
		type: String,
		default: '',
	},
	limit: {
		type: Number,
		default: 1,
	},
	headers: {
		type: Object,
		default: () => {
			return {};
		},
	},
	// 大小限制(MB)
	fileSize: {
		type: Number,
		default: 10,
	},
	showFileList: {
		type: Boolean,
		default: false,
	},
	isShowDownload: {
		type: Boolean,
		default: false,
	},
});

const uploadBase64 = ref<UploadInstance>();

const emit = defineEmits(['getFile']);

const handleBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
	if (props.fileSize) {
		const isLt = rawFile.size / 1024 / 1024 < props.fileSize;
		if (!isLt) {
			ElMessage.warning(`上传文件大小不能超过 ${props.fileSize} MB!`);
			return false;
		}
	}

	// 允许上传的文件格式列表
	let acceptList = props.accept.split(',');
	// 根据文件名获取文件的后缀名
	let name = rawFile.name as any;
	let fileType = name.split('.').pop().toLowerCase();
	// 判断文件格式是否符合要求
	if (acceptList.indexOf(`.${fileType}`) === -1) {
		ElMessage.warning('文件类型不正确');
		return false;
	}
};

const handleHttpRequest = (file: UploadRequestOptions) => {
	const reader = new FileReader();
	reader.readAsDataURL(file.file);
	let fileName = file.file.name;
	let fileType = file.file.type;
	reader.onload = () => {
		emit('getFile', {
			file: reader.result,
			fileName,
			fileType,
		});
		uploadBase64.value?.clearFiles();
	};
};
</script>
<style scoped lang="scss">
.file-upload-container {
	.file-upload-list__item-info {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 350px;
		margin: 0px 0px 0px 4px;

		.file-icon-left {
			width: 15px;
			height: 15px;
			margin-right: 10px;
			--color: inherit;
		}

		.file-icon-right {
			width: 15px;
			height: 15px;
			margin-left: 10px;
			--color: inherit;
		}

		.file-name {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: calc(100% - 44px);
			cursor: default;
		}

		.file-upload {
			width: 40px;
			color: var(--el-color-primary);
			cursor: pointer;
		}

		&:hover {
			color: var(--el-color-primary);
		}
	}
}
</style>
