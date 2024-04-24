import { RouteRecordRaw } from 'vue-router';

/**
 * 建议：路由 path 路径与文件夹名称相同，找文件可浏览器地址找，方便定位文件位置
 *
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

// 扩展 RouteMeta 接口
declare module 'vue-router' {
	interface RouteMeta {
		title?: string;
		isLink?: string;
		isHide?: boolean;
		isKeepAlive?: boolean;
		isAffix?: boolean;
		isIframe?: boolean;
		roles?: string[];
		icon?: string;
	}
}

/**
 * 定义动态路由
 * 前端添加路由，请在顶级节点的 `children 数组` 里添加
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @description 各字段请查看 `@/views/system/menu/component/addMenu.vue 下的 ruleForm`
 * @returns 返回路由菜单数据
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('@/layout/index.vue'),
		redirect: '/home',
		meta: {
			isKeepAlive: true,
		},
		children: [
			{
				path: '/home',
				name: 'home',
				component: () => import('@/views/home/index.vue'),
				meta: {
					title: '首页',
					isLink: '',
					isHide: true,
					isKeepAlive: true,
					isAffix: true,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-shouye',
				},
			},
			{
				path: '/nodeManage',
				name: 'nodeManage',
				component: () => import('@/views/nodeManage/index.vue'),
				meta: {
					title: '节点管理',
					isLink: '',
					isHide: true,
					isKeepAlive: true,
					isAffix: true,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-shouye',
				},
				children: [
					{
						path: '/nodeManage/detail',
						name: 'nodeManageDetail',
						component: () => import('@/views/nodeManage/nodeDetail.vue'),
						meta: {
							title: '节点详情',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-lvzhou_renzhengfangshi_yijianrenzheng',
						},
					},
				],
			},
			{
				path: '/dataManage',
				name: 'dataManage',
				component: () => import('@/views/dataManage/index.vue'),
				meta: {
					title: '数据管理',
					isLink: '',
					isHide: true,
					isKeepAlive: true,
					isAffix: true,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-chanpin1',
				},
				children: [
					{
						path: '/dataManage/detail',
						name: 'dataManageDetail',
						component: () => import('@/views/dataManage/detail.vue'),
						meta: {
							title: '数据详情',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-lvzhou_renzhengfangshi_yijianrenzheng',
						},
					},
				],
				
			},
			{
				path: '/projectManage',
				name: 'projectManage',
				component: () => import('@/views/projectManage/index.vue'),
				meta: {
					title: '项目管理',
					isLink: '',
					isHide: true,
					isKeepAlive: true,
					isAffix: true,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-shouye',
				},
				children: [
					{
						path: '/projectManage/detail',
						name: 'projectManageDetail',
						component: () => import('@/views/projectManage/projectDetail.vue'),
						meta: {
							title: '项目详情',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-lvzhou_renzhengfangshi_yijianrenzheng',
						},
					},
				],
			},
			{
				path: '/componentManage',
				name: 'componentManage',
				component: () => import('@/views/componentManage/index.vue'),
				meta: {
					title: '组件管理',
					isLink: '',
					isHide: true,
					isKeepAlive: true,
					isAffix: true,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-shouye',
				},
			},
			{
				path: '/modelManage',
				name: 'modelManage',
				component: () => import('@/views/modelManage/index.vue'),
				meta: {
					title: '模块管理',
					isLink: '',
					isHide: true,
					isKeepAlive: true,
					isAffix: true,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-shouye',
				},
				children: [
					{
						path: '/modelManage/detail',
						name: 'modelManageDetail',
						component: () => import('@/views/modelManage/detail.vue'),
						meta: {
							title: '模型详情',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-lvzhou_renzhengfangshi_yijianrenzheng',
						},
					},
				],
			},

			{
				path: '/document',
				name: 'document',
				component: () => import('@/views/document/index.vue'),
				meta: {
					title: '接口文档',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
			},
			{
				path: '/individualCenter',
				name: 'individualCenter',
				component: () => import('@/views/individualCenter/index.vue'),
				meta: {
					title: '个人中心',
					isLink: '',
					isHide: true,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-shouye',
				},
			},
			{
				path: '/system',
				name: 'system',
				component: () => import('@/layout/routerView/parent.vue'),
				redirect: '/system/menu',
				meta: {
					title: '系统设置',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/system/menu',
						name: 'systemMenu',
						component: () => import('@/views/system/menu/index.vue'),
						meta: {
							title: '资源管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
					{
						path: '/system/role',
						name: 'systemRole',
						component: () => import('@/views/system/role/index.vue'),
						meta: {
							title: '角色管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-ColdDrink',
						},
					},
					{
						path: '/system/user',
						name: 'systemUser',
						component: () => import('@/views/system/user/index.vue'),
						meta: {
							title: '用户管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-',
						},
					},
					{
						path: '/system/dept',
						name: 'systemDept',
						component: () => import('@/views/system/dept/index.vue'),
						meta: {
							title: '部门管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-OfficeBuilding',
						},
					},
					{
						path: '/system/tenant',
						name: 'systemTenant',
						component: () => import('@/views/system/tenant/index.vue'),
						meta: {
							title: '租户管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-SetUp',
						},
						children: [
							{
								path: '/system/tenant/add',
								name: 'systemTenantAdd',
								component: () => import('@/views/system/tenant/add.vue'),
								meta: {
									title: '新建租户',
									isLink: '',
									isHide: true,
									isKeepAlive: false,
									isAffix: false,
									isIframe: false,
									roles: ['admin'],
									icon: 'iconfont icon-ico',
								},
							},
							{
								path: '/system/tenant/edit',
								name: 'systemTenantEdit',
								component: () => import('@/views/system/tenant/edit.vue'),
								meta: {
									title: '编辑租户',
									isLink: '',
									isHide: true,
									isKeepAlive: false,
									isAffix: false,
									isIframe: false,
									roles: ['admin'],
									icon: 'iconfont icon-ico',
								},
							},
						],
					},
					{
						path: '/system/enterprise',
						name: 'systemEnterprise',
						component: () => import('@/views/system/enterprise/index.vue'),
						meta: {
							title: '企业管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-shuxingtu',
						},
						children: [
							{
								path: '/system/enterprise/detail',
								name: 'systemEnterpriseDetail',
								component: () => import('@/views/system/enterprise/detail.vue'),
								meta: {
									title: '企业管理详情',
									isLink: '',
									isHide: true,
									isKeepAlive: false,
									isAffix: false,
									isIframe: false,
									roles: ['admin'],
									icon: 'iconfont icon-ico',
								},
							},
						],
					},
					{
						path: '/system/enterpriseinfo',
						name: 'systemEnterpriseInfo',
						component: () => import('@/views/system/enterpriseinfo/index.vue'),
						meta: {
							title: '企业信息',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-shuxingtu',
						},
						children: [
							{
								path: '/system/enterpriseinfo/add',
								name: 'systemEnterpriseAdd',
								component: () => import('@/views/system/enterpriseinfo/add.vue'),
								meta: {
									title: '企业信息',
									isLink: '',
									isHide: true,
									isKeepAlive: false,
									isAffix: false,
									isIframe: false,
									roles: ['admin'],
									icon: 'iconfont icon-ico',
								},
							},
						],
					},
				],
			},
			{
				path: '/sm2',
				name: 'sm2',
				component: () => import('@/layout/routerView/parent.vue'),
				redirect: '/sm2/user',
				meta: {
					title: 'SM2证书管理',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/sm2/user',
						name: 'SM2User',
						component: () => import('@/views/SM2/user/index.vue'),
						meta: {
							title: '用户管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
					{
						path: '/sm2/certificate',
						name: 'certificateManagement',
						component: () => import('@/views/SM2/certificate/index.vue'),
						meta: {
							title: '证书管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
				],
			},
			{
				path: '/sm3',
				name: 'sm3',
				component: () => import('@/layout/routerView/parent.vue'),
				redirect: '/sm3/callRecord',
				meta: {
					title: 'SM3加密',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/sm3/callRecord',
						name: 'SM3CallRecord',
						component: () => import('@/views/SM3/callRecord/index.vue'),
						meta: {
							title: 'SM3调用记录',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
				],
			},
			{
				path: '/sm4',
				name: 'sm4',
				component: () => import('@/layout/routerView/parent.vue'),
				redirect: '/sm4/callRecord',
				meta: {
					title: 'SM4加密',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/sm4/callRecord',
						name: 'SM4CallRecord',
						component: () => import('@/views/SM4/callRecord/index.vue'),
						meta: {
							title: 'SM4调用记录',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
				],
			},
			{
				path: '/keyOperation',
				name: 'keyOperation',
				component: () => import('@/layout/routerView/parent.vue'),
				redirect: '/keyOperation/encryptionDemo',
				meta: {
					title: '密钥操作',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/keyOperation/encryptionDemo',
						name: 'encryptionDemo',
						component: () => import('@/views/keyOperation/encryptionDemo/index.vue'),
						meta: {
							title: '加密演示',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
					{
						path: '/keyOperation/decryptionDemo',
						name: 'decryptionDemo',
						component: () => import('@/views/keyOperation/decryptionDemo/index.vue'),
						meta: {
							title: '解密演示',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
					{
						path: '/keyOperation/digitalSignatureDemo',
						name: 'digitalSignatureDemo',
						component: () => import('@/views/keyOperation/digitalSignatureDemo/index.vue'),
						meta: {
							title: '数字签名演示',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
					{
						path: '/keyOperation/verificationSignatureDemo',
						name: 'verificationSignatureDemo',
						component: () => import('@/views/keyOperation/verificationSignatureDemo/index.vue'),
						meta: {
							title: '验证签名演示',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
				],
			},
			{
				path: '/caseManagement',
				name: 'caseManagement',
				component: () => import('@/layout/routerView/parent.vue'),
				redirect: '/caseManagement/liberal',
				meta: {
					title: '实例管理',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/caseManagement/liberal',
						name: 'caseManagementLiberal',
						component: () => import('@/views/caseManagement/liberal/index.vue'),
						meta: {
							title: '开通实例',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
				],
			},
			{
				path: '/sm9',
				name: 'sm9',
				component: () => import('@/layout/routerView/parent.vue'),
				redirect: '/sm9/identificationType',
				meta: {
					title: 'SM9密钥管理',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/sm9/identificationType',
						name: 'identificationType',
						component: () => import('@/views/SM9/identificationType/index.vue'),
						meta: {
							title: '标识类型',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
					{
						path: '/sm9/identificationKey',
						name: 'identificationKey',
						component: () => import('@/views/SM9/identificationKey/index.vue'),
						meta: {
							title: '标识密钥',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
					{
						path: '/sm9/blackList',
						name: 'blackList',
						component: () => import('@/views/SM9/blackList/index.vue'),
						meta: {
							title: '黑名单',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
					{
						path: '/sm9/logQuery',
						name: 'logQuery',
						component: () => import('@/views/SM9/logQuery/index.vue'),
						meta: {
							title: '日志查询',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
				],
			},
			{
				path: '/thresholdKey',
				name: 'thresholdKey',
				component: () => import('@/layout/routerView/parent.vue'),
				redirect: '/thresholdKey/keyGeneration',
				meta: {
					title: '门限密钥服务',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/thresholdKey/keyGeneration',
						name: 'keyGeneration',
						component: () => import('@/views/thresholdKey/keyGeneration/index.vue'),
						meta: {
							title: '密钥生成',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
					{
						path: '/thresholdKey/sMPC',
						name: 'sMPC',
						component: () => import('@/views/thresholdKey/sMPC/index.vue'),
						meta: {
							title: 'sMPC网络',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
				],
			},
			{
				path: '/ZUC',
				name: 'ZUC',
				component: () => import('@/layout/routerView/parent.vue'),
				redirect: '/ZUC/callRecord',
				meta: {
					title: 'ZUC算法',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/ZUC/callRecord',
						name: 'ZUCCallRecord',
						component: () => import('@/views/ZUC/callRecord/index.vue'),
						meta: {
							title: 'ZUC调用记录',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
				],
			},
		],
	},
];

/**
 * 定义404、401界面
 * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
 */
export const notFoundAndNoPower = [
	{
		path: '/:path(.*)*',
		name: 'notFound',
		component: () => import('@/views/error/404.vue'),
		meta: {
			title: '找不到此页面',
			isHide: true,
		},
	},
	{
		path: '/401',
		name: 'noPower',
		component: () => import('@/views/error/401.vue'),
		meta: {
			title: '没有权限',
			isHide: true,
		},
	},
];

/**
 * 定义静态路由（默认路由）
 * 此路由不要动，前端添加路由的话，请在 `dynamicRoutes 数组` 中添加
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login/index.vue'),
		meta: {
			title: '登录',
		},
	},
	{
		path: '/register',
		name: 'registerIndex',
		component: () => import('@/views/register/index.vue'),
		meta: {
			title: '注册',
		},
	},
	{
		path: '/forgotPwd',
		name: 'forgotPwdIndex',
		component: () => import('@/views/forgotPwd/index.vue'),
		meta: {
			title: '忘记密码',
		},
	},
];
