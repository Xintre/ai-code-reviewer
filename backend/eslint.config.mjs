import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const eslintConfig = [
	{
		ignores: ['build'],
	},
	...tseslint.config(
		eslint.configs.recommended,
		tseslint.configs.recommended,
	),
];

export default eslintConfig;
