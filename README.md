# n8n-nodes-runcrate

This is an n8n community node for [Runcrate](https://www.runcrate.ai/?utm_source=n8n&utm_medium=directory&utm_campaign=distribution), an AI cloud with GPUs and an inference API, for AI developers and the agents they run. Use it in workflows, or give it to an n8n AI Agent as a tool, to call open models through Runcrate's OpenAI-compatible API, find GPU offers, run commands on GPUs and launch GPU instances.

[Installation](#installation) · [Operations](#operations) · [Credentials](#credentials) · [Compatibility](#compatibility) · [Usage](#usage) · [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. In n8n: **Settings > Community Nodes > Install**, then enter `n8n-nodes-runcrate`.

## Operations

| Resource | Operations |
| --- | --- |
| Chat | Complete: send a prompt (and an optional system message) to any chat model, with a model dropdown loaded live from the API |
| Model | Get Many: every inference model with its prices and modalities |
| GPU Type | Get Many: launchable GPU configurations with region and hourly price, filterable by GPU type, count and region |
| Job | Create (run a shell command on a fresh GPU machine that stops billing when the command ends), Get, Get Many, Get Logs, Cancel |
| Instance | Create (launch a GPU machine with SSH), Get, Get Many, Get Status, Delete |
| Account | Get Balance |

Jobs always carry a max runtime, and instances can be given one too, so an automation never leaves a GPU running.

## Credentials

1. Create an API key in the [Runcrate dashboard](https://www.runcrate.ai/dashboard/api-keys). Keys start with `rc_live_`.
2. In n8n, add a **Runcrate API** credential and paste the key. The credential test reads your balance.

Runcrate is pay as you go from a prepaid balance: inference is billed per token, image, second or minute depending on the model, and GPUs are priced per GPU-hour, billed by the second on most GPUs and by the minute on a few.

## Compatibility

Built with `@n8n/node-cli` 0.53 and tested on n8n 2.44.

## Usage

- **Chat model in a workflow:** Runcrate > Chat > Complete, pick a model such as `deepseek-ai/DeepSeek-V3.2`, map the prompt from an earlier node. Turn off *Simplify Output* for the full OpenAI-style response.
- **GPU job from a schedule or webhook:** Runcrate > Job > Create with a command like `python train.py`, a GPU type such as `A4000`, `RTX4090` or `H100`, and a max runtime. Poll Job > Get until the status is `succeeded`, then read Job > Get Logs.
- **AI Agent tool:** the node is usable as a tool, so an n8n AI Agent can check GPU prices or start a job itself.
- **OpenAI-compatible:** n8n's own OpenAI Chat Model node also works with Runcrate: set the base URL to `https://api.runcrate.ai/v1`.

## Resources

- [Runcrate docs](https://www.runcrate.ai/docs?utm_source=n8n&utm_medium=directory&utm_campaign=distribution)
- [API reference](https://www.runcrate.ai/docs/api-reference?utm_source=n8n&utm_medium=directory&utm_campaign=distribution) and [OpenAPI spec](https://www.runcrate.ai/openapi.json)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- Support: hello@runcrate.ai

## Version history

- 0.1.2: Published from GitHub Actions with an npm provenance statement; README and keywords describe Runcrate as an AI cloud.
- 0.1.1: Corrected the Runcrate description in the README, package description and Chat operation.
- 0.1.0: Chat, Model, GPU Type, Job, Instance and Account resources.
