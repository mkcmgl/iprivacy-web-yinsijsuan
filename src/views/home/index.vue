<template>
	<div class="home-container layout-pd layout-padding">
		<el-row :gutter="15" class="home-card-header mb15">
			<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
				<div class="bg">
					<div class="title">欢迎回来！{{ state.userName }}</div>
					<div class="time">{{ curTime }}</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="home">
import { reactive, onMounted, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useUserInfo } from '@/stores/userInfo';
import { formatDate } from '@/utils/formatTime';

const router = useRouter();
const state = reactive({
	userName: '',
	roles: <any>[],
});
let timer: number = 0;
let curTime = ref<string>('');
const getTime = () => {
	curTime.value = formatDate(new Date(), 'YYYY-mm-dd HH:MM:SS WWW');
};
// 页面加载时
onMounted(() => {
	const stores = useUserInfo();
	state.userName = stores.userInfos.userName;
	state.roles = stores.userInfos.roles;
	timer = setInterval(() => {
		getTime();
	}, 1000);
});
onBeforeUnmount(() => {
	clearInterval(timer); //清除定时器
	timer = 0;
});
</script>

<style scoped lang="scss">
$homeNavLengh: 8;

.home-container {
	overflow: hidden;
	height: 100%;

	.home-card-header {
		height: 100%;

		.bg {
			width: 100%;
			height: 100%;
			background: url('@/assets/home/headerTwo.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;

			.title {
				font-size: 20px;
				font-weight: 500;
				width: 50%;
				margin-left: 6%;
				margin-top: 30px;
				margin-bottom: 30px;
			}

			.time {
				font-size: 14px;
				font-weight: 500;
				width: 50%;
				margin-left: 6%;
			}
		}
	}

	.home-card-one {
		.home-card-item {
			width: 100%;
			height: 130px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 20px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);

			&:hover {
				box-shadow: 0 2px 12px var(--next-color-dark-hover);
				transition: all ease 0.3s;
			}

			&-icon {
				width: 70px;
				height: 70px;
				border-radius: 100%;
				flex-shrink: 1;

				i {
					color: var(--el-text-color-placeholder);
				}
			}

			&-linkicon {
				width: 33px;
				height: 38px;
				border-radius: 100%;
				flex-shrink: 1;

				i {
					color: var(--el-text-color-placeholder);
				}
			}

			&-title {
				font-size: 15px;
				font-weight: bold;
				height: 30px;
			}
		}
	}

	.home-card-one {
		.count-container {
			display: flex;
			flex-wrap: wrap;
			position: relative;
			box-sizing: border-box;
			background: #fff;

			.count-container-item {
				max-width: 23.75%;
				min-width: 200px;
				flex: 0 0 23.75%;
				margin-top: 20px;
				margin-bottom: 20px;
				margin-left: 1%;
			}

			.count-container-link {
				max-width: 15.5%;
				min-width: 150px;
				flex: 0 0 15.5%;
				margin-top: 20px;
				margin-bottom: 20px;
				margin-left: 1%;
			}

			.count-container-item:last-child,
			.count-container-link:last-child {
				margin-right: 1%;
			}
		}

		@for $i from 0 through 3 {
			.home-one-animation#{$i} {
				opacity: 0;
				animation-name: error-num;
				animation-duration: 0.5s;
				animation-fill-mode: forwards;
				animation-delay: calc($i/4) + s;
			}
		}
	}
}
</style>
