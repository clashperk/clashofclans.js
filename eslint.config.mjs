import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	prettier,
	{
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ['eslint.config.mjs']
				},
				tsconfigRootDir: import.meta.dirname
			}
		},
		rules: {
			'no-process-env': 'off',
			'no-inline-comments': 'off',
			'no-warning-comments': 'off',
			'comma-dangle': ['error', 'never'],
			'arrow-parens': ['error', 'always'],
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
			'@typescript-eslint/no-misused-promises': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-unsafe-declaration-merging': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'no-prototype-builtins': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_'
				}
			]
		}
	},
	{
		ignores: ['dist/**', 'docs/**', 'test/**', 'node_modules/**']
	}
);
