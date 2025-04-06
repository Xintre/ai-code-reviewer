import { ValidationError, ZodInterfaceLike } from './types';

import { CreateCodeReviewRequestDTO } from '@xintre/shared';
import { z } from 'zod';

const schema = z.object({
	code: z.string().nonempty(),
	name: z.string().nonempty(),
} as ZodInterfaceLike<CreateCodeReviewRequestDTO>);

export class CreateCodeReviewRequestDTOValidator {
	/**
	 * Validates the
	 *
	 * @param dto the DTO to validate
	 * @returns `z.ZodError` if failed, or undefined if validated successfully
	 */
	static validate(
		dto: CreateCodeReviewRequestDTO
	): ValidationError | undefined {
		const maybeError = schema.safeParse(dto).error;

		return maybeError ? { validationErrors: maybeError.issues } : undefined;
	}
}
