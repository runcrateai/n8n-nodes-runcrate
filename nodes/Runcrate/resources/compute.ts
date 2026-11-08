import type { INodeProperties } from 'n8n-workflow';

const splitData = {
	postReceive: [{ type: 'rootProperty' as const, properties: { property: 'data' } }],
};

const body = (property: string) => ({ send: { type: 'body' as const, property } });

const showInstance = { resource: ['instance'] };
const showInstanceCreate = { resource: ['instance'], operation: ['create'] };
const showJob = { resource: ['job'] };
const showJobCreate = { resource: ['job'], operation: ['create'] };

export const instanceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showInstance },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Launch a GPU instance',
				description: 'Launch a GPU or CPU machine with SSH, billed while it runs',
				routing: { request: { method: 'POST', url: '/instances' }, output: splitData },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Terminate an instance',
				description: 'Terminate an instance and stop its billing',
				routing: {
					request: { method: 'DELETE', url: '=/instances/{{$parameter.instanceId}}' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an instance',
				routing: {
					request: { method: 'GET', url: '=/instances/{{$parameter.instanceId}}' },
					output: splitData,
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List instances',
				routing: { request: { method: 'GET', url: '/instances' }, output: splitData },
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				action: 'Get the status of an instance',
				description: 'Get the status and IP address of an instance',
				routing: {
					request: { method: 'GET', url: '=/instances/{{$parameter.instanceId}}/status' },
					output: splitData,
				},
			},
		],
		default: 'create',
	},
	{
		displayName: 'Instance ID',
		name: 'instanceId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['instance'], operation: ['delete', 'get', 'getStatus'] } },
		default: '',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: { show: showInstanceCreate },
		default: '',
		placeholder: 'n8n-gpu',
		routing: body('name'),
	},
	{
		displayName: 'GPU Type',
		name: 'gpu_type',
		type: 'string',
		required: true,
		displayOptions: { show: showInstanceCreate },
		default: 'RTX4090',
		description:
			'GPU model, for example H100, H200, A100_80G, L40S or RTX4090. Use GPU Type > Get Many to see what is available now.',
		routing: body('gpu_type'),
	},
	{
		displayName: 'Max Runtime (Minutes)',
		name: 'max_runtime_minutes',
		type: 'number',
		typeOptions: { minValue: 5, maxValue: 10080 },
		displayOptions: { show: showInstanceCreate },
		default: 60,
		description:
			'Terminate the instance automatically this many minutes after it starts running, so an automation never leaves a GPU billing',
		routing: body('max_runtime_minutes'),
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: { show: showInstanceCreate },
		default: {},
		options: [
			{
				displayName: 'GPU Count',
				name: 'gpu_count',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1,
				routing: body('gpu_count'),
			},
			{
				displayName: 'Idle Shutdown (Minutes)',
				name: 'idle_shutdown_minutes',
				type: 'number',
				typeOptions: { minValue: 5, maxValue: 1440 },
				default: 30,
				description:
					'Terminate once GPU utilization stays under 5% with nobody connected for this many minutes',
				routing: body('idle_shutdown_minutes'),
			},
			{
				displayName: 'Instance Type ID',
				name: 'instance_type_id',
				type: 'string',
				default: '',
				description: 'Exact configuration ID from GPU Type > Get Many, instead of the GPU type',
				routing: body('instance_type_id'),
			},
			{
				displayName: 'Launch Script',
				name: 'launch_script',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				description: 'Shell script to run on boot',
				routing: body('launch_script'),
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				placeholder: 'us-east',
				description: 'Region, region prefix, city or country to launch in',
				routing: body('region'),
			},
			{
				displayName: 'SSH Key ID',
				name: 'ssh_key_id',
				type: 'string',
				default: '',
				routing: body('ssh_key_id'),
			},
			{
				displayName: 'Storage Volume ID',
				name: 'storage_id',
				type: 'string',
				default: '',
				description: 'Persistent volume to mount at /workspace',
				routing: body('storage_id'),
			},
			{
				displayName: 'Template ID',
				name: 'template',
				type: 'string',
				default: '',
				description: 'OS or app template to boot from',
				routing: body('template'),
			},
		],
	},
];

export const jobDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showJob },
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				action: 'Cancel a job',
				routing: {
					request: { method: 'POST', url: '=/jobs/{{$parameter.jobId}}/cancel' },
					output: splitData,
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Run a command on a GPU',
				description:
					'Run a shell command on a fresh GPU machine that shuts down and stops billing when the command ends',
				routing: { request: { method: 'POST', url: '/jobs' }, output: splitData },
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a job',
				routing: {
					request: { method: 'GET', url: '=/jobs/{{$parameter.jobId}}' },
					output: splitData,
				},
			},
			{
				name: 'Get Logs',
				value: 'getLogs',
				action: 'Get the output of a job',
				routing: {
					request: { method: 'GET', url: '=/jobs/{{$parameter.jobId}}/logs' },
					output: splitData,
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List jobs',
				routing: { request: { method: 'GET', url: '/jobs' }, output: splitData },
			},
		],
		default: 'create',
	},
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['job'], operation: ['cancel', 'get', 'getLogs'] } },
		default: '',
	},
	{
		displayName: 'Command',
		name: 'command',
		type: 'string',
		required: true,
		typeOptions: { rows: 4 },
		displayOptions: { show: showJobCreate },
		default: '',
		placeholder: 'nvidia-smi && python train.py',
		description: 'Shell command, run with bash in /workspace',
		routing: body('command'),
	},
	{
		displayName: 'GPU Type',
		name: 'gpu_type',
		type: 'string',
		required: true,
		displayOptions: { show: showJobCreate },
		default: 'RTX4090',
		description: 'GPU model, for example H100, A100_80G, L40S, RTX4090 or A4000',
		routing: body('gpu_type'),
	},
	{
		displayName: 'Max Runtime (Minutes)',
		name: 'max_runtime_minutes',
		type: 'number',
		required: true,
		typeOptions: { minValue: 1 },
		displayOptions: { show: showJobCreate },
		default: 30,
		description: 'Longest the command may run. A job never runs unbounded.',
		routing: body('max_runtime_minutes'),
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: { show: showJobCreate },
		default: {},
		options: [
			{
				displayName: 'Container Image',
				name: 'image',
				type: 'string',
				default: '',
				placeholder: 'pytorch/pytorch:latest',
				description: 'Container image to run the command in',
				routing: body('image'),
			},
			{
				displayName: 'Environment Variables (JSON)',
				name: 'env',
				type: 'json',
				default: '{}',
				description: 'Variables for the command, as {"KEY": "value"}',
				routing: {
					send: {
						type: 'body',
						property: 'env',
						value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
					},
				},
			},
			{
				displayName: 'GPU Count',
				name: 'gpu_count',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1,
				routing: body('gpu_count'),
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: body('name'),
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				placeholder: 'us-east',
				routing: body('region'),
			},
			{
				displayName: 'Storage Volume ID',
				name: 'storage_id',
				type: 'string',
				default: '',
				description: 'Persistent volume to mount at /workspace',
				routing: body('storage_id'),
			},
			{
				displayName: 'Template ID',
				name: 'template',
				type: 'string',
				default: '',
				description: 'OS template, default ubuntu-devbox',
				routing: body('template'),
			},
		],
	},
];
