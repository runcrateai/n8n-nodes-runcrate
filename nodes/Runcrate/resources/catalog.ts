import type { INodeProperties } from 'n8n-workflow';

const splitData = {
	postReceive: [{ type: 'rootProperty' as const, properties: { property: 'data' } }],
};

export const modelDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['model'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List inference models',
				description: 'List every model on the inference API with its prices and modalities',
				routing: {
					request: { method: 'GET', baseURL: 'https://api.runcrate.ai/v1', url: '/models' },
					output: splitData,
				},
			},
		],
		default: 'getAll',
	},
];

const showGpuType = { resource: ['gpuType'] };

export const gpuTypeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showGpuType },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List available GPU offers',
				description:
					'List launchable machine configurations with GPU, region and hourly price',
				routing: {
					request: { method: 'GET', url: '/instances/types' },
					output: splitData,
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: { show: showGpuType },
		default: {},
		options: [
			{
				displayName: 'GPU Count',
				name: 'gpu_count',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1,
				routing: { send: { type: 'query', property: 'gpu_count' } },
			},
			{
				displayName: 'GPU Type',
				name: 'gpu_type',
				type: 'string',
				placeholder: 'H100',
				default: '',
				description: 'GPU model, for example H100, A100_80G, RTX4090 or L40S',
				routing: { send: { type: 'query', property: 'gpu_type' } },
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				placeholder: 'us-east',
				default: '',
				routing: { send: { type: 'query', property: 'region' } },
			},
		],
	},
];

export const accountDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['account'] } },
		options: [
			{
				name: 'Get Balance',
				value: 'getBalance',
				action: 'Get the account balance',
				description: 'Get the prepaid credit balance and the cost of running resources',
				routing: {
					request: { method: 'GET', url: '/billing/balance' },
					output: splitData,
				},
			},
		],
		default: 'getBalance',
	},
];
