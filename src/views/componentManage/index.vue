<template>
	<div class="content-main">
		<div class="tool-container">
			<div @click="undo" class="command" title="后退">
				<el-icon><ArrowLeft /></el-icon>
			</div>
			<div @click="redo" class="command" title="前进">
				<el-icon><ArrowRight /></el-icon>
			</div>
			<el-divider direction="vertical" />
			<div @click="copy" class="command" title="复制">
				<el-icon><CopyDocument /></el-icon>
			</div>
			<div @click="paste" class="command" title="粘贴">
				<el-icon><DocumentCopy /></el-icon>
			</div>
			<div @click="del" class="command" title="删除">
				<el-icon><DeleteFilled /></el-icon>
			</div>
			<el-divider direction="vertical" />
			<div @click="save" class="command" title="保存">
				<el-icon><Checked /></el-icon>
			</div>
			<el-divider direction="vertical" />
			<div @click="exportPng" class="command" title="导出PNG">
				<el-icon><Files /></el-icon>
			</div>
		</div>

		<div class="content-container" id="">
			<div class="content">
				<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
					<el-tab-pane label="组件库" name="first">
						<el-collapse v-model="activeNames">
							<el-collapse-item title="可拖拽元素库" name="1" class="leftList">
								<div
									class="leftListBtn"
									v-for="(item, index) in componentList"
									:key="index"
									:title="item.componentName"
									@mousedown="startDragToGraph(item, $event)"
								>
									<el-link :underline="false">
										{{ item.componentName }}
									</el-link>
								</div>
							</el-collapse-item>
						</el-collapse>
						<!-- <el-tree style="max-width: 600px" draggable @node-drag-start="startDragToGraph()" :data="componentList" :props="defaultProps" /> -->
					</el-tab-pane>
					<el-tab-pane label="训练流" name="second"> 训练流 </el-tab-pane>
				</el-tabs>

				<!-- <div class="stencil" ref="stencilContainer"></div> -->
				<div class="graph-content">
					<div class="graph-content">
						<div class="graph-content" id="graphContainer" ref="graphContainer"></div>
					</div>
					<div class="graph-footer">
						<div class="align-center">
							<span style="width: 50px">日志</span>
							<span>输出表</span>
						</div>
					</div>
				</div>

				<!-- <div class="editor-sidebar">
					<div class="edit-panel">
						<el-card shadow="never">
							<template #header>
								<div class="card-header">
									<span>{{ cellFrom.title }}</span>
								</div>
							</template>
							<el-form :model="nodeFrom" label-width="50px" v-if="nodeFrom.show">
								<el-form-item label="label">
									<el-input v-model="nodeFrom.label" @blur="changeLabel" />
								</el-form-item>
								<el-form-item label="desc">
									<el-input type="textarea" v-model="nodeFrom.desc" @blur="changeDesc" />
								</el-form-item>
							</el-form>
							<el-form :model="cellFrom" label-width="50px" v-if="cellFrom.show">
								<el-form-item label="label">
									<el-input v-model="cellFrom.label" @blur="changeEdgeLabel" />
								</el-form-item>
								<el-form-item label="连线方式">
                    <el-select v-model="cellFrom.edgeType" class="m-2" placeholder="Select"  @change="changeEdgeType">
                      <el-option
                        v-for="item in EDGE_TYPE_LIST"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type"
                      />
                    </el-select>
                  </el-form-item> 
							</el-form>
						</el-card>
					</div>
					<div>
						<el-card shadow="never">
							<template #header>
								<div class="card-header">
									<span>Minimap</span>
								</div>
							</template>
							<div class="minimap" ref="miniMapContainer"></div>
						</el-card>
					</div>
				</div> 
      -->
			</div>
		</div>
		<!-- <div v-if="showMenu" class="node-menu" ref="nodeMenu">
			<div class="menu-item" v-for="(item, index) in PROCESSING_TYPE_LIST" :key="index" @click="addNodeTool(item)">
				<el-image :src="item.image" style="width: 16px; height: 16px" fit="fill" />
				<span>{{ item.name }}</span>
			</div>
		</div> -->

		<el-drawer class="drawerComponent" v-model="handleShowRight" :direction="direction">
			<template #header>
				<h4>{{ nodeRightData.label }}</h4>
			</template>
			<template #default>
				<div class="pd-l-10">
					<div class="mg-b-20" v-for="item in faQiProjectList" :key="item.enterpriseId">
						<div>
							<span>发起方：</span>
							<span>{{ item.enterpriseName }}</span>
						</div>
						<el-button type="primary" @click="handlerOpenDialog('faqi')">选择数据</el-button>
					</div>
					<div class="mg-b-20" v-for="(item, index) in xieZuoProjectList" :key="item.enterpriseId">
						<div>
							<span>{{ `协作方${index + 1}：` }}</span>
							<span>{{ item.enterpriseName }}</span>
						</div>
						<el-button type="primary" @click="handlerOpenDialog(index + 1)">选择数据</el-button>
					</div>

					<!-- 
						<el-form
						ref="formDataRef"
						:model="formData"
						:rules="formDataRules"
						label-width="auto"
						class="demo-ruleForm"
						status-icon
						label-position="left"
						size="small"
					>
						<el-form-item label="组件 ID:">
							{{ nodeRightData.id }}
						</el-form-item>
						<el-form-item label="组件类型:"> 横向 </el-form-item>
						<el-form-item label="样本表选择" prop="selectDataId"> </el-form-item>
						<el-select v-model="formData.selectDataId" placeholder="请选择样本表">
							<el-option v-for="item in formList" :key="item.dataId" :label="item.name" :value="item.dataId" />
						</el-select>
					</el-form> -->
					<div class="drawer-footer">
						<el-button type="primary" @click="confirmClick">确认</el-button>
						<el-button @click="cancelClick">取消</el-button>
					</div>
				</div>
			</template>
			<template #footer> </template>
		</el-drawer>
		<el-dialog v-model="dialogVisible" :title="dialogTitle" width="600">
			<el-table ref="multipleTableRef" :data="rightTableList.dataList" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" />
				<el-table-column label="机构名称" width="150" show-overflow-tooltip>
					<template #default="scope">{{ scope.row.name }}</template>
				</el-table-column>
				<el-table-column property="nodeName" label="所属节点" width="120" />
				<el-table-column property="dataType" label="数据格式" show-overflow-tooltip />
				<el-table-column property="createTime" label="创建时间" show-overflow-tooltip />
			</el-table>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="updateDialogTableList"> 确认 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { Graph, Path, Edge, StringExt, Node, Cell, Model, DataUri } from '@antv/x6';
import { Transform } from '@antv/x6-plugin-transform';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { MiniMap } from '@antv/x6-plugin-minimap';
//import { Scroller } from '@antv/x6-plugin-scroller'
import { Stencil } from '@antv/x6-plugin-stencil';
import { Export } from '@antv/x6-plugin-export';
import { ArrowLeft, ArrowRight, CopyDocument, DocumentCopy, DeleteFilled, Checked, Files } from '@element-plus/icons-vue';
import { ref, onMounted, reactive, toRefs, onUpdated, nextTick, onUnmounted, computed } from 'vue';
// import '@/styles/animation.less'
import { ElMessage } from 'element-plus';
import { Dnd } from '@antv/x6-plugin-dnd';
import { updateComponent, allListComponent, detailComponent, projectDataComponent, pageListComponent } from '@/api/componentManage';
import { projectDetail } from '@/api/projectManage';
import { ComponentNodeState, DetailComponentLines, DetailComponents, NodeRightData } from '@/types/views';
import { ElMessageBox, FormRules, FormInstance } from 'element-plus';
import type { DrawerProps } from 'element-plus';
const stencilContainer = ref();
const graphContainer = ref();
const miniMapContainer = ref();
const activeNames = ref(['1']);
const image = {
	logo: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*evDjT5vjkX0AAAAAAAAAAAAAARQnAQ',
};
let graph: any = null;
const startDragToGraph = (item: any, e: any) => {
	console.log(`output->item,egraph.getNodes().length;`, item, e, graph.getNodes().length);
	// if (item.disabled == false) {

	const node = graph.createNode({
		// 自己设置拖拽元素的具体属性，此处不赘述
		shape: 'custom-node',
		width: 140, //节点的宽度
		height: 26, //节点的高度

		// id: item.moduleName.toLowerCase() + (Number(graph.getNodes().length) + 1),
		// data: item,
		attrs: {
			body: {
				// fill: item.bodyFill,
				// stroke: item.stroke,
			},
			image: {
				'xlink:href': image.logo,
			},

			text: {
				fill: item.textFill,
				text: item.componentName,
				refX: 40,
				refY: 15,
				fontSize: 15,
				'text-anchor': 'start',
			},
			// markup: [
			// 	{
			// 		tagName: 'rect',
			// 		selector: 'body',
			// 	},
			// 	{
			// 		tagName: 'image',
			// 		selector: 'image',
			// 	},
			// 	{
			// 		tagName: 'text',
			// 		selector: 'text',
			// 	},
			// 	// {
			// 	// 	tagName: 'text',
			// 	// 	selector: 'label',
			// 	// },
			// ],
		},
		// ports: getPortsByDataCode(
		// 	item.inputDataAnchor,
		// 	item.inputModelAnchor,
		// 	item.outputDataAnchor,
		// 	item.outputModelAnchor,
		// 	item.outputDataParam,
		// 	item.inputDataParam
		// ),
	});
	const position = getDownstreamNodePosition(node, graph);
	console.log(`output->node,graph`, node, graph);
	const dnd = new Dnd({
		target: graph,
		getDragNode: (node) => node.clone({ keepId: true }),
		getDropNode: (node) => node.clone({ keepId: true }),
		// ☆拖拽结束时，验证节点是否可以放置到目标画布中。
		// validateNode: () => {
		// 	console.log('成功拖拽至目标画布');
		// },
	});
	dnd.start(node, e);
	// } else {
	// 	return;
	// }
};
const getPortsByDataCode = (
	inputDataAnchor: any,
	inputModelAnchor: any,
	outputDataAnchor: any,
	outputModelAnchor: any,
	outputDataParam: any,
	inputDataParam: any
) => {
	const ports = [];

	// 生成输入数据端口
	for (let i = 0; i < inputDataAnchor; i++) {
		ports.push({
			id: `inputData${i}`,
			group: 'in',
			attrs: {
				circle: {
					fill: 'blue',
					stroke: '#666',
					strokeWidth: 2,
					r: 5,
					magnet: true,
				},
				label: {
					text: `输入数据${i}`,
					fill: 'white',
					fontSize: 12,
				},
			},
		});
	}

	// 生成输入模型端口
	for (let i = 0; i < inputModelAnchor; i++) {
		ports.push({
			id: `inputModel${i}`,
			group: 'in',
			attrs: {
				circle: {
					fill: 'purple',
					stroke: '#666',
					strokeWidth: 2,
					r: 5,
					magnet: true,
				},
				label: {
					text: `输入模型${i}`,
					fill: 'white',
					fontSize: 12,
				},
			},
		});
	}

	// 生成输出数据端口
	for (let i = 0; i < outputDataAnchor; i++) {
		ports.push({
			id: `outputData${i}`,
			group: 'out',
			attrs: {
				circle: {
					fill: 'green',
					stroke: '#666',
					strokeWidth: 2,
					r: 5,
					magnet: true,
				},
				label: {
					text: `输出数据${i}`,
					fill: 'white',
					fontSize: 12,
				},
			},
		});
	}

	// 生成输出模型端口
	for (let i = 0; i < outputModelAnchor; i++) {
		ports.push({
			id: `outputModel${i}`,
			group: 'out',
			attrs: {
				circle: {
					fill: 'orange',
					stroke: '#666',
					strokeWidth: 2,
					r: 5,
					magnet: true,
				},
				label: {
					text: `输出模型${i}`,
					fill: 'white',
					fontSize: 12,
				},
			},
		});
	}

	// 定义端口分组
	const groups = {
		in: {
			position: {
				name: 'left',
			},
			attrs: {
				rect: {
					fill: '#f5f5f5',
					stroke: '#d9d9d9',
					strokeWidth: 1,
					width: 50,
					height: 100,
				},
			},
		},
		out: {
			position: {
				name: 'right',
			},
			attrs: {
				rect: {
					fill: '#f5f5f5',
					stroke: '#d9d9d9',
					strokeWidth: 1,
					width: 50,
					height: 100,
				},
			},
		},
	};
	console.log(`output->portsConfig`, {
		ports: ports,
		groups: groups,
	});
	// 返回端口配置
	return ports;
};
const state = reactive({
	cellFrom: {
		title: 'Canvas',
		label: '',
		desc: '',
		show: false,
		id: '',
		edgeType: 'topBottom',
	},
	nodeFrom: {
		title: 'Canvas',
		label: '',
		desc: '',
		show: false,
		id: '',
	},

	showMenu: false,
	// data: {
	// 	nodes: [
	// 		{
	// 			id: 'ac51fb2f-2753-4852-8239-53672a29bb14',
	// 			position: {
	// 				x: -340,
	// 				y: -280,
	// 			},
	// 			data: {
	// 				name: '随机分割',
	// 				type: 'OUTPUT',
	// 				desc: '春望',
	// 			},
	// 		},
	// 		{
	// 			id: '81004c2f-0413-4cc6-8622-127004b3befa',
	// 			position: {
	// 				x: -340,
	// 				y: -100,
	// 			},
	// 			data: {
	// 				name: '隐私求交',
	// 				type: 'SYNC',
	// 				desc: '国破山河在',
	// 			},
	// 		},
	// 		{
	// 			id: '7505da25-1308-4d7a-98fd-e6d5c917d35d',
	// 			position: {
	// 				x: -140,
	// 				y: 10,
	// 			},
	// 			data: {
	// 				name: '异常处理',
	// 				type: 'INPUT',
	// 				desc: '城春草木胜',
	// 			},
	// 		},
	// 	],
	// 	edges: [
	// 		{
	// 			id: '6eea5dc9-4e15-4e78-959f-ee13ec59d11c',
	// 			shape: 'processing-curve',
	// 			source: { cell: 'ac51fb2f-2753-4852-8239-53672a29bb14', port: '-out' },
	// 			target: { cell: '81004c2f-0413-4cc6-8622-127004b3befa', port: '-in' },
	// 			zIndex: -1,
	// 			data: {
	// 				source: 'ac51fb2f-2753-4852-8239-53672a29bb14',
	// 				target: '81004c2f-0413-4cc6-8622-127004b3befa',
	// 			},
	// 		},
	// 		{
	// 			id: '8cbce713-54be-4c07-8efa-59c505f74ad7',
	// 			// labels: ['下半句'],
	// 			shape: 'processing-curve',
	// 			source: { cell: '81004c2f-0413-4cc6-8622-127004b3befa', port: '-out' },
	// 			target: { cell: '7505da25-1308-4d7a-98fd-e6d5c917d35d', port: '-in' },
	// 			data: {
	// 				source: '81004c2f-0413-4cc6-8622-127004b3befa',
	// 				target: '7505da25-1308-4d7a-98fd-e6d5c917d35d',
	// 			},
	// 		},
	// 	],
	// },
	// 节点状态列表
	nodeStatusList: [
		{
			id: 'ac51fb2f-2753-4852-8239-53672a29bb14',
			status: 'success',
		},
		{
			id: '81004c2f-0413-4cc6-8622-127004b3befa',
			status: 'success',
		},
	],

	// 边状态列表
	edgeStatusList: [
		{
			id: '6eea5dc9-4e15-4e78-959f-ee13ec59d11c',
			status: 'success',
		},
		{
			id: '8cbce713-54be-4c07-8efa-59c505f74ad7',
			status: 'executing',
		},
	],
	// 加工类型列表
	PROCESSING_TYPE_LIST: [
		{
			type: 'SYNC',
			name: '隐私求交',
			image: image.logo,
		},
		{
			type: 'INPUT',
			name: '异常处理',
			image: image.logo,
		},
	],
	//边类型
	EDGE_TYPE_LIST: [
		{
			type: 'topBottom',
			name: '上下',
		},
		{
			type: 'leftRight',
			name: '左右',
		},
	],
});
const formDataRef = ref<FormInstance>();
const formData = ref({
	selectDataId: '',
});
interface User {
	date: string;
	name: string;
	address: string;
}
const defaultProps = {
	label: 'componentName',
};
const activeName = ref('first');
const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
};
const tableData: User[] = [
	{
		date: '2016-05-03',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles',
	},
	{
		date: '2016-05-02',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles',
	},
];
const formDataRules = reactive<FormRules>({
	selectDataId: [{ required: true, message: '请选择样本表', trigger: 'change' }],
});

const formList = ref(<NodeRightData[]>[]);

const handleShowRight = ref(false);
const nodeRightData = ref(<NodeRightData>{});
const direction = ref<DrawerProps['direction']>('rtl');
function cancelClick() {
	handleShowRight.value = false;
}
function confirmClick() {
	formDataRef.value?.validate((valid: FormInstance) => {
		if (valid) {
			console.log(`output->graph`, graph, graph.getSelectedCells()[0], graph.getSelectedCells());
			const selectedNode = graph.getSelectedCells()[0];
			if (selectedNode) {
				const data = selectedNode.getData();
				const newData = data.map((item: any) => ({
					...item, // 展开原始对象的所有属性
					selectDataId: formData.value.selectDataId, // 添加新的 selectDataId 属性并赋值为 1
				}));
				console.log(`output->newDatanewData`, newData);
				// data[0].selectDataId =formData.value.selectDataId;
				selectedNode.replaceData(newData);
			}
			handleShowRight.value = false;
		}
	});
}

const dialogVisible = ref(false);
const dialogTitle = ref('');
const faQiProjectList = ref([]);
const xieZuoProjectList = ref([]);
const getProjectDetail = () => {
	faQiProjectList.value = [];
	projectDetail({ projectId: 'd0542a3a34ec4237834a8009bbcc5551' }).then((res) => {
		faQiProjectList.value = res.data.projectPartnerList.filter((item: { enterpriseId: string }) => item.enterpriseId == res.data.enterpriseId);

		xieZuoProjectList.value = res.data.projectPartnerList;
		console.log(`output->faQiProjectList--xieZuoProjectList.value `, faQiProjectList.value, xieZuoProjectList.value);
	});
};
const rightTableList = ref({});
const openDialogIndex = ref('');
const handlerOpenDialog = (type: string | Number) => {
	rightTableList.value = {};
	if (type == 'faqi') {
		openDialogIndex.value = '0';
		rightTableList.value = faQiProjectList.value[0];
		dialogTitle.value = '选择发起方数据';
		dialogVisible.value = true;
	} else {
		openDialogIndex.value = type + '';
		rightTableList.value = xieZuoProjectList.value[Number(type) - 1];
		dialogTitle.value = `选择协作${type}数据`;
		dialogVisible.value = true;
	}
	console.log(`output->rightTableList.value`, rightTableList.value);
};
const updateDialogTableList = async () => {
	save(nodeRightData.value, true);
};
const selectDialogTableDataList = ref([]);

const handleSelectionChange = (val: any) => {
	selectDialogTableDataList.value = val;
	nodeRightData.value.data.params = val;
	console.log(`output->valnodeRightData.value`, val, nodeRightData.value.data);
};

const { cellFrom, nodeFrom, showMenu, PROCESSING_TYPE_LIST } = toRefs(state);

let nodeMenu = ref();

// 节点类型
enum NodeType {
	INPUT = 'INPUT', // 数据输入
	FILTER = 'FILTER', // 数据过滤
	JOIN = 'JOIN', // 数据连接
	UNION = 'UNION', // 数据合并
	AGG = 'AGG', // 数据聚合
	OUTPUT = 'OUTPUT', // 数据输出
	SYNC = 'SYNC', //数据同步
}

// 元素校验状态
// enum CellStatus {
//   DEFAULT = 'default',
//   SUCCESS = 'success',
//   ERROR = 'error'
// }

// 节点位置信息
interface Position {
	x: number;
	y: number;
}

function init() {
	graph = new Graph({
		container: graphContainer.value,
		grid: true,
		panning: {
			enabled: true,
			eventTypes: ['leftMouseDown', 'mouseWheel'],
		},
		mousewheel: {
			enabled: true,
			modifiers: 'ctrl',
			factor: 1.1,
			maxScale: 1.5,
			minScale: 0.5,
		},
		highlighting: {
			magnetAdsorbed: {
				name: 'stroke',
				args: {
					attrs: {
						fill: '#fff',
						stroke: '#31d0c6',
						strokeWidth: 4,
					},
				},
			},
		},
		connecting: {
			snap: true,
			allowBlank: false,
			allowLoop: false,
			highlight: true,
			// sourceAnchor: {
			//   name: 'bottom',
			//   args: {
			//     dx: 0,
			//   },
			// },
			// targetAnchor: {
			//   name: 'top',
			//   args: {
			//     dx: 0,
			//   },
			// },
			createEdge() {
				return graph.createEdge({
					shape: 'processing-curve',
					attrs: {
						line: {
							strokeDasharray: '0 0',
						},
					},
					zIndex: -1,
				});
			},
			// 连接桩校验
			validateConnection({ sourceMagnet, targetMagnet }) {
				// 只能从输出链接桩创建连接
				if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
					return false;
				}
				// 只能连接到输入链接桩
				if (!targetMagnet || targetMagnet.getAttribute('port-group') === 'out') {
					return false;
				}
				return true;
			},
		},
	});
	graph.centerContent();

	// #region 使用插件
	graph
		.use(
			new Transform({
				resizing: true,
				rotating: true,
			})
		)
		.use(
			new Selection({
				rubberband: true,
				showNodeSelectionBox: true,
			})
		)
		.use(
			new MiniMap({
				container: miniMapContainer.value,
				width: 200,
				height: 260,
				padding: 10,
			})
		)
		.use(new Snapline())
		.use(new Keyboard())
		.use(new Clipboard())
		.use(new History())
		.use(new Export());
	//.use(new Scroller({
	//  enabled: true,
	//  pageVisible: true,
	//  pageBreak: false,
	//  pannable: true,

	// }))
	// #endregion

	// #region 初始化图形
	const ports = {
		groups: {
			in: {
				position: 'top',
				attrs: {
					circle: {
						r: 4,
						magnet: true,
						stroke: '#5F95FF',
						strokeWidth: 1,
						fill: '#fff',
						style: {
							visibility: 'hidden',
						},
					},
				},
			},
			out: {
				position: 'bottom',
				attrs: {
					circle: {
						r: 4,
						magnet: true,
						stroke: '#31d0c6',
						strokeWidth: 1,
						fill: '#fff',
						style: {
							visibility: 'hidden',
						},
					},
				},
			},
			left: {
				position: 'left',
				attrs: {
					circle: {
						r: 4,
						magnet: true,
						stroke: '#5F95FF',
						strokeWidth: 1,
						fill: '#fff',
						style: {
							visibility: 'hidden',
						},
					},
				},
			},
			right: {
				position: 'right',
				attrs: {
					circle: {
						r: 4,
						magnet: true,
						stroke: '#5F95FF',
						strokeWidth: 1,
						fill: '#fff',
						style: {
							visibility: 'hidden',
						},
					},
				},
			},
		},
		// items: [
		//   {
		//     id: state.currentCode + '-in',
		//     group: 'top',
		//   },
		//   {
		//     id: state.currentCode + '-out',
		//     group: 'out',
		//   }
		// ],
	};

	Graph.registerNode(
		'custom-node',
		{
			inherit: 'rect',
			width: 140,
			height: 26,
			attrs: {
				body: {
					strokeWidth: 1,
				},
				image: {
					width: 16,
					height: 16,
					x: 12,
					y: 6,
				},
				text: {
					refX: 40,
					refY: 15,
					fontSize: 15,
					'text-anchor': 'start',
				},
				// label: {
				// 	text: '12313',
				// 	refX: 10,
				// 	refY: 30,
				// 	fontSize: 12,
				// 	fill: 'rgba(0,0,0,0.6)',
				// 	'text-anchor': 'start',
				// 	textWrap: {
				// 		width: -10, // 宽度减少 10px
				// 		height: '70%', // 高度为参照元素高度的一半
				// 		ellipsis: true, // 文本超出显示范围时，自动添加省略号
				// 		breakWord: true, // 是否截断单词
				// 	},
				// },
			},
			markup: [
				{
					tagName: 'rect',
					selector: 'body',
				},
				{
					tagName: 'image',
					selector: 'image',
				},
				{
					tagName: 'text',
					selector: 'text',
				},
				// {
				// 	tagName: 'text',
				// 	selector: 'label',
				// },
			],
			data: {},
			relation: {},
			ports: { ...ports },
		},
		true
	);

	// const stencil = new Stencil({
	// 	//新建节点库
	// 	title: '数据集成',
	// 	target: graph,
	// 	search: false, // 搜索
	// 	collapsable: true,
	// 	stencilGraphWidth: 200, //容器宽度
	// 	// stencilGraphHeight: 100, //容器长度
	// 	groups: [
	// 		//分组
	// 		{
	// 			name: 'processLibrary',
	// 			title: 'dataSource',
	// 		},
	// 	],
	// 	layoutOptions: {
	// 		dx: 40,
	// 		dy: 10,
	// 		columns: 1, //列数（行内节点数）
	// 		columnWidth: 100, //列宽
	// 		rowHeight: 40, //行高
	// 	},
	// });
	// stencilContainer.value.appendChild(stencil.container);

	// 控制连接桩显示/隐藏
	// eslint-disable-next-line no-undef
	const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
		for (let i = 0, len = ports.length; i < len; i += 1) {
			ports[i].style.visibility = show ? 'visible' : 'hidden';
		}
	};
	graph.on('node:mouseenter', () => {
		const container = graphContainer.value;
		const ports = container.querySelectorAll('.x6-port-body');
		showPorts(ports, true);
	});
	graph.on('node:mouseleave', () => {
		const container = graphContainer.value;
		const ports = container.querySelectorAll(
			'.x6-port-body'
			// eslint-disable-next-line no-undef
		) as NodeListOf<SVGElement>;
		showPorts(ports, false);
	});
	graph.on('node:move', ({ e, x, y, node,view }) => {
		console.log(`output->{ e, node, view }`, e,x,y, node, node,view);
		const container = graphContainer.value;
		const ports = container.querySelectorAll(
			'.x6-port-body'
			// eslint-disable-next-line no-undef
		) as NodeListOf<SVGElement>;
		showPorts(ports, false);
	});
	// #region 快捷键与事件
	graph.bindKey(['meta+c', 'ctrl+c'], () => {
		// const cells = graph.getSelectedCells()
		// if (cells.length) {
		//   graph.copy(cells)
		// }
		// return false
		copy();
	});
	graph.bindKey(['meta+x', 'ctrl+x'], () => {
		const cells = graph.getSelectedCells();
		if (cells.length) {
			graph.cut(cells);
		}
		return false;
	});
	graph.bindKey(['meta+v', 'ctrl+v'], () => {
		// if (!graph.isClipboardEmpty()) {
		//   const cells = graph.paste({ offset: 32 })
		//   graph.cleanSelection()
		//   graph.select(cells)
		// }
		// return false
		paste();
	});

	// undo redo
	graph.bindKey(['meta+z', 'ctrl+z'], () => {
		// if (graph.canUndo()) {
		//   graph.undo()
		// }
		// return false
		undo();
	});
	graph.bindKey(['meta+y', 'ctrl+y'], () => {
		// if (graph.canRedo()) {
		//   graph.redo()
		// }
		// return false
		redo();
	});
	// select all
	graph.bindKey(['meta+a', 'ctrl+a'], () => {
		const nodes = graph.getNodes();
		if (nodes) {
			graph.select(nodes);
		}
	});

	// delete
	graph.bindKey(['backspace', 'del'], () => {
		// const cells = graph.getSelectedCells()
		// if (cells.length) {
		//   graph.removeCells(cells)
		// }
		del();
	});

	// zoom
	graph.bindKey(['ctrl+1', 'meta+1'], () => {
		const zoom = graph.zoom();
		if (zoom < 1.5) {
			graph.zoom(0.1);
		}
	});
	graph.bindKey(['ctrl+2', 'meta+2'], () => {
		const zoom = graph.zoom();
		if (zoom > 0.5) {
			graph.zoom(-0.1);
		}
	});
	// 节点移入画布事件
	graph.on('node:added', ({ node }: any) => {
		// console.log(node,);
		addNodeInfo(node);
		// const { x, y } = node.position()
		// console.log(`output-> x, y`, x, y);
	});
	//  节点单击事件
	graph.on('node:click', ({ node }: any) => {
		//  console.log(node,cell)
		addNodeInfo(node);
	});

	//节点被选中时显示添加节点按钮
	graph.on('node:selected', (args: { cell: Cell; node: Node; options: Model.SetOptions }) => {
		if (NodeType.INPUT != args.node.data.type) {
			args.node.removeTools();
			// args.node.addTools({
			// 	name: 'button',
			// 	args: {
			// 		x: 0,
			// 		y: 0,
			// 		offset: { x: 160, y: 15 },
			// 		markup: [
			// 			//自定义的删除按钮样式
			// 			{
			// 				tagName: 'circle',
			// 				selector: 'button',
			// 				attrs: {
			// 					r: 8,
			// 					stroke: 'rgba(0,0,0,.25)',
			// 					strokeWidth: 1,
			// 					fill: 'rgba(255, 255, 255, 1)',
			// 					cursor: 'pointer',
			// 				},
			// 			},
			// 			{
			// 				tagName: 'text',
			// 				textContent: '+',
			// 				selector: 'icon',
			// 				attrs: {
			// 					fill: 'rgba(0,0,0,.25)',
			// 					fontSize: 15,
			// 					textAnchor: 'middle',
			// 					pointerEvents: 'none',
			// 					y: '0.3em',
			// 					stroke: 'rgba(0,0,0,.25)',
			// 				},
			// 			},
			// 		],
			// 		onClick({ e, view }: any) {
			// 			//      console.log(e,cell);
			// 			showNodeTool(e, view);
			// 		},
			// 	},
			// });
		}
		handleShowRight.value = true;
		nodeRightData.value = args.node as unknown as NodeRightData;
		getProjectDetail();
		// projectDataComponent({ projectId: 'd0542a3a34ec4237834a8009bbcc5551' }).then((res) => {
		// 	formList.value = res.data;
		// 	console.log(`output->res`, res);
		// });
		console.log('test', args);
		// code here
	});

	//节点被取消选中时触发。
	graph.on('node:unselected', (args: { cell: Cell; node: Node; options: Model.SetOptions }) => {
		args.node.removeTools();
		handleShowRight.value = false;
		state.showMenu = false;
	});

	// 添加边事件
	graph.on('edge:added', ({ edge }: any) => {
		// console.log(edge);
		addEdgeInfo(edge);
		edge.data = {
			source: edge.source.cell,
			target: edge.target.cell,
		};
	});
	//  线单击事件
	graph.on('edge:click', ({ edge }: any) => {
		//  console.log(node,cell)
		addEdgeInfo(edge);
	});

	//边选中事件
	graph.on('edge:selected', (args: { cell: Cell; edge: Edge; options: Model.SetOptions }) => {
		args.edge.attr('line/strokeWidth', 3);
	});

	//边被取消选中时触发。
	graph.on('edge:unselected', (args: { cell: Cell; edge: Edge; options: Model.SetOptions }) => {
		args.edge.attr('line/strokeWidth', 1);
	});

	const nodeShapes = [
		{
			label: '开始',
			nodeType: 'OUTPUT' as NodeType,
		},
		{
			label: '数据同步',
			nodeType: 'SYNC' as NodeType,
		},
		{
			label: '结束',
			nodeType: 'INPUT' as NodeType,
		},
	];

	// const nodes = nodeShapes.map((item) => {
	// 	const id = StringExt.uuid();
	// 	const node = {
	// 		id: id,
	// 		shape: 'custom-node',
	// 		// label: item.label,
	// 		ports: getPortsByType(item.nodeType, id),
	// 		data: {
	// 			name: `${item.label}`,
	// 			type: item.nodeType,
	// 		},
	// 		attrs: getNodeAttrs(item.nodeType),
	// 	};
	// 	const newNode = graph.addNode(node);
	// 	return newNode;
	// });

	//#endregion
	// stencil.load(nodes, 'processLibrary');
}

// 根据节点的类型获取ports
const getPortsByType = (type: NodeType, nodeId: string) => {
	let ports = [] as any;
	switch (type) {
		case NodeType.INPUT:
			ports = [
				{
					id: `${nodeId}-in`,
					group: 'in',
				},
				{
					id: `${nodeId}-left`,
					group: 'left',
				},
				{
					id: `${nodeId}-right`,
					group: 'right',
				},
			];
			break;
		case NodeType.OUTPUT:
			ports = [
				{
					id: `${nodeId}-out`,
					group: 'out',
				},
				{
					id: `${nodeId}-left`,
					group: 'left',
				},
				{
					id: `${nodeId}-right`,
					group: 'right',
				},
			];
			break;
		default:
			ports = [
				{
					id: `${nodeId}-in`,
					group: 'in',
				},
				{
					id: `${nodeId}-out`,
					group: 'out',
				},
				{
					id: `${nodeId}-left`,
					group: 'left',
				},
				{
					id: `${nodeId}-right`,
					group: 'right',
				},
			];
			break;
	}
	return ports;
};

// 注册连线 --上下
Graph.registerConnector(
	'curveConnectorTB',
	(s, e) => {
		const offset = 4;
		const deltaY = Math.abs(e.y - s.y);
		const control = Math.floor((deltaY / 3) * 2);

		const v1 = { x: s.x, y: s.y + offset + control };
		const v2 = { x: e.x, y: e.y - offset - control };

		return Path.normalize(
			`M ${s.x} ${s.y}
         L ${s.x} ${s.y + offset}
         C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
         L ${e.x} ${e.y}
        `
		);
	},
	true
);

// 注册连线--左右
Graph.registerConnector(
	'curveConnectorLR',
	(sourcePoint, targetPoint) => {
		const hgap = Math.abs(targetPoint.x - sourcePoint.x);
		const path = new Path();
		path.appendSegment(Path.createSegment('M', sourcePoint.x - 4, sourcePoint.y));
		path.appendSegment(Path.createSegment('L', sourcePoint.x + 12, sourcePoint.y));
		// 水平三阶贝塞尔曲线
		path.appendSegment(
			Path.createSegment(
				'C',
				sourcePoint.x < targetPoint.x ? sourcePoint.x + hgap / 2 : sourcePoint.x - hgap / 2,
				sourcePoint.y,
				sourcePoint.x < targetPoint.x ? targetPoint.x - hgap / 2 : targetPoint.x + hgap / 2,
				targetPoint.y,
				targetPoint.x - 6,
				targetPoint.y
			)
		);
		path.appendSegment(Path.createSegment('L', targetPoint.x + 2, targetPoint.y));

		return path.serialize();
	},
	true
);

Graph.registerEdge(
	'processing-curve',
	{
		inherit: 'edge',
		markup: [
			{
				tagName: 'path',
				selector: 'wrap',
				attrs: {
					fill: 'none',
					cursor: 'pointer',
					stroke: 'transparent',
					strokeLinecap: 'round',
				},
			},
			{
				tagName: 'path',
				selector: 'line',
				attrs: {
					fill: 'none',
					pointerEvents: 'none',
				},
			},
		],
		connector: { name: 'smooth' }, //curveConnectorTB
		attrs: {
			wrap: {
				connection: true,
				strokeWidth: 10,
				strokeLinejoin: 'round',
			},
			line: {
				connection: true,
				stroke: '#A2B1C3',
				strokeWidth: 1,
				targetMarker: {
					name: 'classic',
					size: 6,
				},
			},
		},
	},
	true
);

// Graph.registerEdge(
//   'processing-curve-lr',
//   {
//   inherit: 'edge',
//   markup: [
//       {
//         tagName: 'path',
//         selector: 'wrap',
//         attrs: {
//           fill: 'none',
//           cursor: 'pointer',
//           stroke: 'transparent',
//           strokeLinecap: 'round',
//         },
//       },
//       {
//         tagName: 'path',
//         selector: 'line',
//         attrs: {
//           fill: 'none',
//           pointerEvents: 'none',
//         },
//       },
//     ],
//     connector: { name: 'curveConnectorLR' },
//     attrs: {
//       wrap: {
//         connection: true,
//         strokeWidth: 10,
//         strokeLinejoin: 'round',
//       },
//       line: {
//         connection: true,
//         stroke: '#A2B1C3',
//         strokeWidth: 1,
//         targetMarker: {
//           name: 'classic',
//           size: 6,
//         },
//       },
//     },
// },
//   true,
// )

//保存
const componentLines = ref(<any>[]);
const components = ref(<any>[]);
const componentsParams = ref(<any>[]);
const nextNode = ref('');
const save = (node?: NodeRightData, update?: boolean): boolean | void => {
	console.log('save');
	componentLines.value = [];
	components.value = [];
	componentsParams.value = [];
	const graphData = graph.toJSON();
	console.log(graphData, componentLines.value);
	const filtered = graphData.cells.filter((item: { shape: string }) => item.shape == 'processing-curve');
	console.log(`output->filtered`, filtered);
	filtered.forEach((item: { source: any; target: any }) => {
		componentLines.value.push({
			sourceCode: { moduleCode: item.source.cell, port: item.source.port, name: item.source.port.includes('Data') ? 'data' : 'model' },
			targetCode: { moduleCode: item.target.cell, port: item.target.port, name: item.source.port.includes('Data') ? 'data' : 'model' },
		});
	});
	const filterComponents = graphData.cells.filter((item: { shape: string }) => item.shape == 'custom-node');
	nextNode.value = filterComponents[filterComponents.length - 1].zIndex;
	console.log(`output->filterComponents`, filterComponents);
	filterComponents.forEach(
		(item: {
			[x: string]: any;
			data: {
				[x: string]: any;
				componentFieldList: any[];
				componentName: any;
				moduleName: string;
			};
			id: any;
			zIndex: any;
			position: { x: any; y: any };
		}) => {
			if ((node as NodeRightData).id == item.id && update) {
				components.value.push({
					componentId: item.data.id,
					componentName: item.data.componentName,
					moduleCode: item.id,
					moduleName: item.data.moduleName,
					coordX: item.position.x,
					coordY: item.position.y,
					params: nodeRightData.value.data.params,
				});
			} else {
				componentsParams.value = [];
				if (item.data.componentFieldList) {
					console.log(`output->item.data.componentFieldList`, item.data.componentFieldList);

					item.data.componentFieldList.forEach((item: { defaultValue: any; paramName: any; param_id: any }) => {
						componentsParams.value.push({
							defaultValue: item.defaultValue,
							paramName: item.paramName,
							paramId: item.param_id,
							paramValue: '',
						});
					});
				} else if (Array.isArray(item.data)) {
					console.log(`output->itemitemitem`, item);
					item.data?.forEach((item: { id: string; defaultValue: string; paramName: string; param_id: string }) => {
						// if (update) {

						// }
						componentsParams.value.push({
							defaultValue: item.defaultValue,
							paramName: item.paramName,
							paramId: item.param_id,
							paramValue: '',
						});
					});
				} else {
					console.log(`output->objec`, item);
					componentsParams.value = item.data.params;
				}
				console.log(`output->componentsParams.valuecomponentsParams.value`, componentsParams.value);
				components.value.push({
					componentId: item.data.id,
					componentName: item.data.componentName,
					moduleCode: item.id,
					moduleName: item.data.moduleName,
					coordX: item.position.x,
					coordY: item.position.y,
					params: componentsParams.value,
				});
			}
		}
	);
	console.log(graphData, componentLines.value, components.value);

	updateComponent({
		pipelineId: '1780869825745375233',
		nextNode: nextNode.value,
		components: components.value,
		componentLines: componentLines.value,
	})
		.then((res) => {
			if (res.resultCode == '0') {
				if (update) {
					dialogVisible.value = false;
				}
				ElMessage.success('保存成功');
			}
		})
		.catch((err) => {
			ElMessage.error(err);
			console.log(`output->err`, err);
		});
};

//撤销
function undo() {
	if (graph.canUndo()) {
		graph.undo();
	}
	return false;
}
//取消撤销
function redo() {
	if (graph.canRedo()) {
		graph.redo();
	}
	return false;
}
//复制
function copy() {
	const cells = graph.getSelectedCells();
	if (cells.length) {
		graph.copy(cells);
	}
	return false;
}
//粘贴
function paste() {
	if (!graph.isClipboardEmpty()) {
		const cells = graph.paste({ offset: 32 });
		graph.cleanSelection();
		graph.select(cells);
	}
	return false;
}
//删除
function del() {
	const cells = graph.getSelectedCells();
	if (cells.length) {
		graph.removeCells(cells);
	}
}

//导出PNG
function exportPng() {
	graph.toPNG(
		(dataUri: string) => {
			// 下载
			DataUri.downloadDataUri(dataUri, 'chart.png');
		},
		{
			padding: {
				top: 20,
				right: 20,
				bottom: 20,
				left: 20,
			},
		}
	);
	//graph.exportPNG('a.png',{padding:'20px'});
}

function addNodeInfo(node: any) {
	state.nodeFrom.title = 'Node';
	state.nodeFrom.label = node.label;
	// state.nodeFrom.desc = node.attrs.label.text;
	state.nodeFrom.show = true;
	state.nodeFrom.id = node.id;
	state.cellFrom.show = false;
}

function addEdgeInfo(edge: any) {
	state.nodeFrom.show = false;
	state.cellFrom.title = 'Edge';
	if (edge.labels[0]) {
		state.cellFrom.label = edge.labels[0].attrs.label.text;
	} else {
		state.cellFrom.label = '';
	}
	state.cellFrom.edgeType = edge.data ? edge.data.edgeType : '';
	state.cellFrom.show = true;
	state.cellFrom.id = edge.id;
}
//修改文本
function changeLabel() {
	const nodes = graph.getNodes();
	nodes.forEach((node: any) => {
		if (state.nodeFrom.id == node.id) {
			node.label = state.nodeFrom.label;
		}
	});
}

//修改描述
function changeDesc() {
	const nodes = graph.getNodes();
	nodes.forEach((node: any) => {
		if (state.nodeFrom.id == node.id) {
			node.attr('label/text', state.nodeFrom.desc);
		}
	});
}

//修改边文本
function changeEdgeLabel() {
	const edges = graph.getEdges();
	edges.forEach((edge: any) => {
		if (state.cellFrom.id == edge.id) {
			edge.setLabels(state.cellFrom.label);
			console.log(`edge11111111`, edge);
		}
	});
}

//修改边的类型
// function changeEdgeType() {
//   const edges = graph.getEdges()
//   edges.forEach((edge: any) => {
//     if (state.cellFrom.id == edge.id) {
//       //    console.log(state.cellFrom.edgeType);
//       if (state.cellFrom.edgeType == 'topBottom') {
//         edge.setConnector('curveConnectorTB')
//       } else {
//         edge.setConnector('curveConnectorLR')
//         //      console.log(edge);
//       }
//       edge.data.edgeType = state.cellFrom.edgeType
//     }
//   })
// }

const getNodeAttrs = (nodeType: string) => {
	let attr = {} as any;
	switch (nodeType) {
		case NodeType.INPUT:
			attr = {
				image: {
					'xlink:href': image.logo,
				},
				//左侧拖拽样式
				body: {
					fill: '#edc3ae',
					stroke: '#f9723d',
				},
				text: {
					text: '异常处理',
					fill: '#f9723d',
				},
			};
			break;
		case NodeType.SYNC:
			attr = {
				image: {
					'xlink:href': image.logo,
				},
				//左侧拖拽样式
				body: {
					fill: '#b9dec9',
					stroke: '#229453',
				},
				text: {
					text: '隐私求交',
					fill: '#229453',
				},
			};
			break;
		case NodeType.OUTPUT:
			attr = {
				image: {
					'xlink:href': image.logo,
				},
				//左侧拖拽样式
				body: {
					fill: '#EFF4FF',
					stroke: '#5F95FF',
				},
				text: {
					text: '随机分割',
					fill: '#5F95FF',
				},
			};
			break;
	}
	return attr;
};

//加载初始节点
function getData() {
	let cells = [] as any;
	detailComponentsList.value.map((node: ComponentNodeState) => {
		// let attr = getNodeAttrs(node.data.type);
		// if (node.data.desc) {
		// attr.label = { text: node.data.desc };
		// }
		const detailComponentsListXY = detailComponents.value.filter((item: DetailComponents) => item.componentId == node.id);
		console.log(`output->node detailComponentsListXY`, node, detailComponentsListXY,cells);

		// if (node.componentName) {
		// 	let temp = attr.text;
		// 	if (temp) {
		// 		temp.text = node.componentName;
		// 	}
		// }
		for (let i = 0; i < detailComponentsListXY.length; i++) {
			cells.push(
				graph.addNode({
					id: (detailComponentsListXY[i] as unknown as DetailComponents).moduleCode,
					x: (detailComponentsListXY[i] as unknown as DetailComponents).coordX,
					y: (detailComponentsListXY[i] as unknown as DetailComponents).coordY,
					shape: 'custom-node',
					attrs: {
						image: {
							'xlink:href': image.logo,
						},
						text: {
							text: node.componentName,
							refX: 40,
							refY: 15,
							fontSize: 15,
							'text-anchor': 'start',
						},
					},
					ports: getPortsByDataCode(
						node.inputDataAnchor,
						node.inputModelAnchor,
						node.outputDataAnchor,
						node.outputModelAnchor,
						node.outputDataParam,
						node.inputDataParam
					),
					data: detailComponentsListXY[i],
					// {
					// 	...node.componentFieldList,
					// 	params:(detailComponentsListXY[i] as unknown as DetailComponents).params
					// },
				})
			);
		}
	});
	detailComponentLines.value.map((edge: DetailComponentLines) => {
		cells.push(
			graph.addEdge({
				id: StringExt.uuid(),
				source: { cell: edge.sourceCode.moduleCode, port: edge.sourceCode.port },
				target: { cell: edge.targetCode.moduleCode, port: edge.targetCode.port },
				// zIndex: edge.zIndex,
				shape: 'processing-curve',
				//  connector: { name: 'curveConnector' },
				// labels: edge.labels,
				attrs: { line: { strokeDasharray: '0 0' } },
				// data: edge.data,
			})
		);
	});
	graph.resetCells(cells);
}

// 开启边的运行动画
const excuteAnimate = (edge: any) => {
	edge.attr({
		line: {
			stroke: '#3471F9',
		},
	});
	edge.attr('line/strokeDasharray', 0);
	edge.attr('line/style/animation', 'running-line 30s infinite linear');
};

// 显示边状态
const showEdgeStatus = () => {
	state.edgeStatusList.forEach((item) => {
		const edge = graph.getCellById(item.id);
		edge.attr('line/strokeDasharray', 0);
		if (item.status == 'success') {
			edge.attr('line/stroke', '#52c41a');
		} else if ('error' == item.status) {
			edge.attr('line/stroke', '#ff4d4f');
		} else if ('executing' == item.status) {
			excuteAnimate(edge);
		}
	});
};

// 显示添加按钮菜单
function showNodeTool(e: any, _view: any) {
	//  console.log(view);
	state.showMenu = true;
	nextTick(() => {
		nodeMenu.value.style.top = e.offsetY + 60 + 'px';
		nodeMenu.value.style.left = e.offsetX + 210 + 'px';
	});
}

// 点击添加节点按钮
// function addNodeTool(item: any) {
// 	//  console.log(item);
// 	createDownstream(item.type);
// 	state.showMenu = false;
// }

/**
 * 根据起点初始下游节点的位置信息
 * @param node 起始节点
 * @param graph
 * @returns
 */
const getDownstreamNodePosition = (node: Node, graph: Graph, dx = 250, dy = 100) => {
	// 找出画布中以该起始节点为起点的相关边的终点id集合
	const downstreamNodeIdList: string[] = [];
	graph.getEdges().forEach((edge) => {
		const originEdge = edge.toJSON()?.data;
		console.log(node);
		if (originEdge.source === node.id) {
			downstreamNodeIdList.push(originEdge.target);
		}
	});
	// 获取起点的位置信息
	const position = node.getPosition();
	let minX = Infinity;
	let maxY = -Infinity;
	graph.getNodes().forEach((graphNode) => {
		if (downstreamNodeIdList.indexOf(graphNode.id) > -1) {
			const nodePosition = graphNode.getPosition();
			// 找到所有节点中最左侧的节点的x坐标
			if (nodePosition.x < minX) {
				minX = nodePosition.x;
			}
			// 找到所有节点中最x下方的节点的y坐标
			if (nodePosition.y > maxY) {
				maxY = nodePosition.y;
			}
		}
	});

	return {
		x: minX !== Infinity ? minX : position.x + dx,
		y: maxY !== -Infinity ? maxY + dy : position.y,
	};
};

// // 创建下游的节点和边
// const createDownstream = (type: NodeType) => {
// 	//  console.log(graph.getSelectedCells());
// 	const cells = graph.getSelectedCells();
// 	if (cells.length == 1) {
// 		const node = cells[0];
// 		//console.log(node,"node");
// 		if (graph) {
// 			// 获取下游节点的初始位置信息
// 			const position = getDownstreamNodePosition(node, graph);
// 			// 创建下游节点
// 			const newNode = createNode(type, graph, position);
// 			const source = node.id;
// 			const target = newNode.id;
// 			// 创建该节点出发到下游节点的边
// 			createEdge(source, target, graph);
// 		}
// 	} else {
// 		ElMessage({
// 			message: '请选择一个节点',
// 			type: 'warning',
// 		});
// 	}
// };

const createNode = (type: NodeType, graph: Graph, position?: Position): Node => {
	let newNode = {} as Node;
	const typeName = state.PROCESSING_TYPE_LIST?.find((item) => item.type === type)?.name;
	const id = StringExt.uuid();
	const node = {
		id,
		shape: 'custom-node',
		x: position?.x,
		y: position?.y,
		ports: getPortsByType(type, id),
		data: {
			name: `${typeName}`,
			type,
		},
		attrs: getNodeAttrs(type),
	};
	newNode = graph.addNode(node);
	return newNode;
};

const createEdge = (source: string, target: string, graph: Graph) => {
	const edge = {
		id: StringExt.uuid(),
		shape: 'processing-curve',
		source: {
			cell: source,
			// port: `${source}-out`,
		},
		target: {
			cell: target,
			//  port: `${target}-in`,
		},
		zIndex: -1,
		data: {
			source,
			target,
		},
		attrs: { line: { strokeDasharray: '5 5' } },
	};
	// console.log(edge);
	if (graph) {
		graph.addEdge(edge);
	}
};
const componentList = ref<ComponentNodeState[]>([]);
const getAllListComponent = () => {
	allListComponent().then((res) => {
		componentList.value = res.data;
		getDetailComponent();
	});
};
const detailComponents = ref([]);
const detailComponentLines = ref([]);
const detailComponentsList = ref<ComponentNodeState[]>([]);
const getDetailComponent = () => {
	detailComponent({ pipelineId: '1780857887904747521' }).then((res) => {
		detailComponents.value = res.data.components;
		detailComponentLines.value = res.data.componentLines;
		detailComponentsList.value = componentList.value.filter((item: { id: string }) => {
			return detailComponents.value.some((detail: { componentId: string }) => detail.componentId == item.id);
		});
		getData();
	});
};

const getPageListComponent = () => {
	pageListComponent().then((res) => {
		console.log(`output-pageListComponent>res`, res);
	});
};
onMounted(() => {
	init();
	getAllListComponent();
	// getPageListComponent();
	// getDetailComponent();

});
onUpdated(() => {
	// getData();
});
onUnmounted(() => {
	graph.dispose();
});
</script>

<style lang="scss" scoped>
.content-main {
	display: flex;
	width: 100%;
	flex-direction: column;
	height: calc(100vh - 180px);
	background-color: #ffffff;
	position: relative;
	:deep(.el-overlay) {
		position: absolute;
		z-index: 99 !important;
	}
	.tool-container {
		padding: 8px;
		display: flex;
		align-items: center;
		color: rgba(0, 0, 0, 0.45);

		.command {
			font-size: 12px;
			display: inline-block;
			width: 27px;
			height: 27px;
			margin: 0 6px;
			padding-top: 6px;
			text-align: center;
			cursor: pointer;
		}
	}
}
.leftList {
	width: 120px;
}
.drawer-footer {
	display: flex;
	justify-content: center;
	border-top: 1px solid;
	padding-top: 20px;
}
.graph-footer {
	height: 36px;
	position: absolute;
	bottom: 0;
	width: calc(100vw - 400px) !important;
	background-color: #fff;
	transition: width 0.1s;
}
.leftListBtn {
	margin-left: 10px;
}
.graph-content {
	width: calc(100vw - 400px) !important;
	height: calc(100vh - 260px) !important;
}
.content-container {
	position: relative;
	width: 100%;
	height: 100%;
	.content {
		width: 100%;
		height: 100%;
		position: relative;

		min-width: 400px;
		min-height: 600px;
		display: flex;
		border: 1px solid #dfe3e8;
		flex-direction: row;
		//   flex-wrap: wrap;
		flex: 1 1;

		.stencil {
			width: 250px;
			height: 100%;
			border-right: 1px solid #dfe3e8;
			position: relative;

			:deep(.x6-widget-stencil) {
				background-color: #fff;
			}
			:deep(.x6-widget-stencil-title) {
				background-color: #fff;
			}
			:deep(.x6-widget-stencil-group-title) {
				background-color: #fff !important;
			}
		}

		.editor-sidebar {
			display: flex;
			flex-direction: column;
			border-left: 1px solid #e6f7ff;
			background: #fafafa;
			z-index: 9;

			.el-card {
				border: none;
			}
			.edit-panel {
				flex: 1 1;
				background-color: #fff;
			}

			:deep(.x6-widget-minimap-viewport) {
				border: 1px solid #8f8f8f;
			}

			:deep(.x6-widget-minimap-viewport-zoom) {
				border: 1px solid #8f8f8f;
			}
		}
	}
}

:deep(.x6-widget-transform) {
	margin: -1px 0 0 -1px;
	padding: 0px;
	border: 1px solid #239edd;
}
:deep(.x6-widget-transform > div) {
	border: 1px solid #239edd;
}
:deep(.x6-widget-transform > div:hover) {
	background-color: #3dafe4;
}
:deep(.x6-widget-transform-active-handle) {
	background-color: #3dafe4;
}
:deep(.x6-widget-transform-resize) {
	border-radius: 0;
}
:deep(.x6-widget-selection-inner) {
	border: 1px solid #239edd;
}
:deep(.x6-widget-selection-box) {
	opacity: 0;
}

.topic-image {
	visibility: hidden;
	cursor: pointer;
}
.x6-node:hover .topic-image {
	visibility: visible;
}
.x6-node-selected rect {
	stroke-width: 2px;
}
.node-menu {
	position: absolute;
	box-shadow: var(--el-box-shadow-light);
	background: var(--el-bg-color-overlay);
	border: 1px solid var(--el-border-color-light);
	padding: 5px 0px;

	.menu-item {
		display: flex;
		align-items: center;
		white-space: nowrap;
		list-style: none;
		line-height: 22px;
		padding: 5px 16px;
		margin: 0;
		font-size: var(--el-font-size-base);
		color: var(--el-text-color-regular);
		cursor: pointer;
		outline: none;
		box-sizing: border-box;
	}

	.menu-item .el-image {
		margin-right: 5px;
	}

	.menu-item:hover {
		background-color: var(--el-color-primary-light-9);
		color: var(--el-color-primary);
	}
}
</style>
