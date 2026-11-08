import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { chatDescription } from './resources/chat';
import { accountDescription, gpuTypeDescription, modelDescription } from './resources/catalog';
import { instanceDescription, jobDescription } from './resources/compute';

export class Runcrate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Runcrate',
		name: 'runcrate',
		icon: { light: 'file:runcrate.svg', dark: 'file:runcrate.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Run open models and launch GPUs on Runcrate',
		defaults: {
			name: 'Runcrate',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'runcrateApi', required: true }],
		requestDefaults: {
			baseURL: 'https://www.runcrate.ai/api/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Chat', value: 'chat' },
					{ name: 'GPU Type', value: 'gpuType' },
					{ name: 'Instance', value: 'instance' },
					{ name: 'Job', value: 'job' },
					{ name: 'Model', value: 'model' },
				],
				default: 'chat',
			},
			...accountDescription,
			...chatDescription,
			...gpuTypeDescription,
			...instanceDescription,
			...jobDescription,
			...modelDescription,
		],
	};
}
