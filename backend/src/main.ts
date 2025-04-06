import 'dotenv/config';
import 'reflect-metadata';

import {
	CreateCodeReviewRequestDTO,
	CreateCodeReviewResponseDTO,
} from '@xintre/shared';

import { AppDataSource } from '@/database/data-source';
import { CodeReview } from '@/database/entity/CodeReview';
import { CreateCodeReviewRequestDTOValidator } from './validators/CreateCodeReviewRequestDTOValidator';
import { DummyCodeReviewService } from '@/services/DummyCodeReviewService';
import { ICodeReviewService } from '@/services/ICodeReviewService';
import { OpenAICodeReviewService } from '@/services/OpenAICodeReviewService';
import { ValidationError } from './validators/types';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import process from 'process';
import signale from 'signale';

async function main() {
	await AppDataSource.initialize();

	const reviewerStrategy = process.env.REVIEWER_STRATEGY_OPTION;

	let codeReviewService: ICodeReviewService;
	switch (reviewerStrategy) {
		case 'dummy':
			codeReviewService = new DummyCodeReviewService();
			break;

		case 'openai':
			codeReviewService = new OpenAICodeReviewService();
			break;

		default:
			signale.fatal(
				`Invalid REVIEWER_STRATEGY_OPTION env var value '${reviewerStrategy}', exiting`
			);
			process.exit(1);
	}

	signale.info(
		`Chosen CR reviewer strategy '${codeReviewService.getName()}'`
	);

	const app = express();
	app.use(helmet());
	app.use(cors());
	app.use(express.json());

	const PORT = process.env.PORT ?? 8000;

	app.listen(PORT, () => {
		signale.success(`Server running on port ${PORT}`);
	});

	app.post<
		{},
		CreateCodeReviewResponseDTO | ValidationError,
		CreateCodeReviewRequestDTO
	>('/api/code-review', async (req, res) => {
		// validate request
		const maybeValidationError =
			CreateCodeReviewRequestDTOValidator.validate(req.body);

		if (maybeValidationError) {
			res.status(400).send(maybeValidationError);
			return;
		}

		const reviewString = await codeReviewService.reviewCode(req.body.code);

		const codeReview = new CodeReview();
		codeReview.code = req.body.code;
		codeReview.snippetName = req.body.name;
		codeReview.review = reviewString;

		await AppDataSource.manager.save(codeReview);

		res.send({ review: reviewString });
	});

	// 404 middleware - must be at the end of the file!
	app.use((_req, res, _next) => {
		res.status(404).send('404 Not Found - please try something else');
	});

	// 500 ISE middleware - must be at the end of the file!
	app.use((err: any, _req: any, res: any, _next: any) => {
		console.error(err.stack);
		res.status(500).send('500 ISE - something went wrong');
	});
}

main();
