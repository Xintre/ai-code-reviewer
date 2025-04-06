import { ClientOptions, OpenAI } from 'openai';

import { ICodeReviewService } from './ICodeReviewService';

export class OpenAICodeReviewService extends ICodeReviewService {
	private openai: OpenAI;

	constructor() {
		super();

		const configuration: ClientOptions = {
			apiKey: process.env.OPENAI_API_KEY,
		};

		this.openai = new OpenAI(configuration);
	}

	async reviewCode(code: string): Promise<string> {
		const response = await this.openai.responses.create({
			model: 'gpt-4o-mini',
			instructions:
				'You are a coding assistant that should review the code provided by the user (programmer). ' +
				'Please be concise, never disclose who you are or talk with the user / answer any questions. ' +
				'Always just output multiple sentences describing different aspects of the code that can be improved. ' +
				'Separate different sections / lines with newline character. ' +
				'Make sure you include either quotes of the passed-in code or specific line number.',
			input: code,
		});

		return response.output_text;
	}

	getName() {
		return 'OpenAI';
	}
}
