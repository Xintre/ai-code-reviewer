export abstract class ICodeReviewService {
	abstract reviewCode(code: string): Promise<string>;

	abstract getName(): string;
}
