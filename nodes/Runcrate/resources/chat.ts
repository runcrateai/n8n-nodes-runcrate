import type { INodeProperties } from 'n8n-workflow';

const INFERENCE_URL = 'https://api.runcrate.ai/v1';

const show = { resource: ['chat'] };

export const chatDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Complete',
				value: 'complete',
				action: 'Send a prompt to a model',
				description: 'Create a chat completion with any Runcrate open model',
				routing: {
					request: {
						method: 'POST',
						baseURL: INFERENCE_URL,
						url: '/chat/completions',
					},
				},
			},
		],
		default: 'complete',
	},
	{
		displayName: 'Model Name or ID',
		name: 'model',
		type: 'options',
		required: true,
		displayOptions: { show },
		typeOptions: {
			loadOptions: {
				routing: {
					request: {
						method: 'GET',
						baseURL: INFERENCE_URL,
						url: '/models',
					},
					output: {
						postReceive: [
							{ type: 'rootProperty', properties: { property: 'data' } },
							{
								type: 'filter',
								properties: {
									pass: '={{ ($responseItem.output_modalities || []).includes("text") }}',
								},
							},
							{
								type: 'setKeyValue',
								properties: {
									name: '={{$responseItem.name || $responseItem.id}}',
									value: '={{$responseItem.id}}',
								},
							},
							{ type: 'sort', properties: { key: 'name' } },
						],
					},
				},
			},
		},
		default: '',
		description:
			'Model to use. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		routing: { send: { type: 'body', property: 'model' } },
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		required: true,
		typeOptions: { rows: 4 },
		displayOptions: { show },
		default: '',
		description: 'The user message to send',
	},
	{
		displayName: 'Simplify Output',
		name: 'simplify',
		type: 'boolean',
		displayOptions: { show },
		default: true,
		description:
			'Whether to return only the reply text, model and token usage instead of the full API response',
		routing: {
			output: {
				postReceive: [
					{
						type: 'setKeyValue',
						enabled: '={{$value}}',
						properties: {
							content: '={{$responseItem.choices[0].message.content}}',
							model: '={{$responseItem.model}}',
							finish_reason: '={{$responseItem.choices[0].finish_reason}}',
							usage: '={{$responseItem.usage}}',
						},
					},
				],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: { show },
		default: {},
		options: [
			{
				displayName: 'Max Tokens',
				name: 'max_tokens',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1024,
				description: 'Maximum number of tokens to generate',
				routing: { send: { type: 'body', property: 'max_tokens' } },
			},
			{
				displayName: 'System Message',
				name: 'system',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Instructions sent before the prompt',
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 2, numberPrecision: 2 },
				default: 0.7,
				description: 'Sampling temperature. Lower is more focused, higher is more varied.',
				routing: { send: { type: 'body', property: 'temperature' } },
			},
		],
	},
	{
		displayName: 'Messages',
		name: 'messagesBody',
		type: 'hidden',
		displayOptions: { show },
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'messages',
				value:
					'={{ ($parameter.options.system ? [{ role: "system", content: $parameter.options.system }] : []).concat([{ role: "user", content: $parameter.prompt }]) }}',
			},
		},
	},
];
