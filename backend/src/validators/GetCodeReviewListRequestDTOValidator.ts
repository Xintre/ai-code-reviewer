import { ValidationError, ZodInterfaceLike } from './types';

import { GetCodeReviewListRequestDTO } from '@xintre/shared';
import { z } from 'zod';

const schema = z
	.object({} as ZodInterfaceLike<GetCodeReviewListRequestDTO>)
	.strict();

export class GetCodeReviewListRequestDTOValidator {
	/**
	 * Validates the
	 *
	 * @param dto the DTO to validate
	 * @returns `z.ZodError` if failed, or undefined if validated successfully
	 */
	static validate(
		dto: GetCodeReviewListRequestDTO,
	): ValidationError | undefined {
		const maybeError = schema.safeParse(dto).error;

		return maybeError ? { validationErrors: maybeError.issues } : undefined;
	}
}
