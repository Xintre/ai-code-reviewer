import { ZodIssue, ZodTypeAny } from 'zod';

/**
 * Typed interface for a type paramater T to reassign value of every shallow key to ZodTypeAny
 */
export type ZodInterfaceLike<T> = {
	[k in keyof T]: ZodTypeAny;
};

export type ValidationError = {
	validationErrors: ZodIssue[];
};
