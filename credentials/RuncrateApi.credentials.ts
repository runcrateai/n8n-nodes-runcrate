import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RuncrateApi implements ICredentialType {
	name = 'runcrateApi';

	displayName = 'Runcrate API';

	icon = { light: 'file:../nodes/Runcrate/runcrate.svg', dark: 'file:../nodes/Runcrate/runcrate.dark.svg' } as const;

	documentationUrl = 'https://www.runcrate.ai/docs/api-reference';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'A Runcrate API key (starts with rc_live_), from https://www.runcrate.ai/dashboard/api-keys',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://www.runcrate.ai/api/v1',
			url: '/billing/balance',
		},
	};
}
