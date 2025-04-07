import 'dotenv/config';
import 'reflect-metadata';

import {
	CreateCodeReviewRequestDTO,
	CreateCodeReviewResponseDTO,
	GetCodeReviewListRequestDTO,
} from '@xintre/shared';
import express, { Request, Response } from 'express';

import { AppDataSource } from '@/database/data-source';
import { CodeReview } from '@/database/entity/CodeReview';
import { CreateCodeReviewRequestDTOValidator } from './validators/CreateCodeReviewRequestDTOValidator';
import { DummyCodeReviewService } from '@/services/DummyCodeReviewService';
import { GetCodeReviewListRequestDTOValidator } from './validators/GetCodeReviewListRequestDTOValidator';
import { GetCodeReviewListResponseDTO } from '@xintre/shared/src/dto/GetCodeReviewListResponseDTO';
import { ICodeReviewService } from '@/services/ICodeReviewService';
import { OpenAICodeReviewService } from '@/services/OpenAICodeReviewService';
import { ValidationError } from './validators/types';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
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
				`Invalid REVIEWER_STRATEGY_OPTION env var value '${reviewerStrategy}', exiting`,
			);
			process.exit(1);
	}

	signale.info(
		`Chosen CR reviewer strategy '${codeReviewService.getName()}'`,
	);

	const app = express();
	app.use(helmet());
	app.use(cors());
	app.use(express.json());

	app.use(morgan('combined'));

	const PORT = process.env.PORT ?? 8000;

	app.listen(PORT, () => {
		signale.success(`Server running on port ${PORT}`);
	});

	app.post<
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		{},
		CreateCodeReviewResponseDTO | ValidationError,
		CreateCodeReviewRequestDTO
	>('/api/code-review', async (req, res) => {
		// validate request
		const maybeValidationError =
			CreateCodeReviewRequestDTOValidator.validate(req.body);

		if (maybeValidationError) {
			res.status(400).send(maybeValidationError);
			signale.error(
				'Invalid request to CR creation endpoint',
				maybeValidationError,
			);
			return;
		}

		const reviewString = await codeReviewService.reviewCode(req.body.code);

		const codeReview = new CodeReview();
		codeReview.code = req.body.code;
		codeReview.snippetName = req.body.name;
		codeReview.review = reviewString;
		codeReview.language = req.body.language;

		await codeReview.save();

		res.send({ review: reviewString });
	});

	app.get<
		GetCodeReviewListRequestDTO,
		GetCodeReviewListResponseDTO | ValidationError
	>('/api/code-review/list', async (req, res) => {
		// validate request
		const maybeValidationError =
			GetCodeReviewListRequestDTOValidator.validate(req.params);

		if (maybeValidationError) {
			res.status(400).send(maybeValidationError);
			signale.error(
				'Invalid request to CR list endpoint',
				maybeValidationError,
			);
			return;
		}

		const reviews = await CodeReview.find({});

		res.send({
			reviewList: reviews.map((review) => ({
				id: review.id,
				code: review.code,
				review: review.review,
				name: review.snippetName,
				createdAt: review.createdAt.valueOf(),
				language: review.language,
			})),
		});
	});

	// 404 middleware - must be at the end of the file!
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	app.use((_req, res, _next) => {
		res.status(404).send('404 Not Found - please try something else');
	});

	// 500 ISE middleware - must be at the end of the file!
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	app.use((err: Error, _req: Request, res: Response, _next: unknown) => {
		console.error(err.stack);
		res.status(500).send('500 ISE - something went wrong');
	});
}

main();
