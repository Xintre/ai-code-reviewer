export type CodeReviewDTO = {
	id: number;
	name: string;
	code: string;
	createdAt: number;
	review: string;
	language: string;
};

export type GetCodeReviewListResponseDTO = {
	reviewList: CodeReviewDTO[];
};
