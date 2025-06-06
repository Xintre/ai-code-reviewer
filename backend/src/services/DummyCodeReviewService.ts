import { ICodeReviewService } from './ICodeReviewService';
import { LoremIpsum } from 'lorem-ipsum';

export class DummyCodeReviewService extends ICodeReviewService {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async reviewCode(_code: string): Promise<string> {
		return new LoremIpsum().generateParagraphs(
			Math.max(1, Math.round(Math.random() * 3)),
		);
	}

	getName() {
		return 'Local Dummy (Lorem Ipsum)';
	}
}
