'use client';

import {
	CreateCodeReviewRequestDTO,
	CreateCodeReviewResponseDTO,
} from '@xintre/shared';
import { FormEvent, useMemo, useState } from 'react';
import { Grid, TextField } from '@mui/material';

import Editor from '@monaco-editor/react';
import { FaintDivider } from '@/components/FaintDivider';
import { ResponseBox } from '@/components/ResponseBox';
import { SubmitButton } from '@/components/SubmitButton';
import { fetchPOST } from '@/utils/apiClient';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMutation } from '@tanstack/react-query';
import { useTheme } from '@mui/material';

export default function IDE() {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark' ? 'vs-dark' : 'light';
	const isMdOrSmaller = useMediaQuery(theme.breakpoints.down('md'));

	const [code, setCode] = useState<string>('console.log("Hi there 👋")');
	const [snippetName, setSnippetName] = useState<string>('');
	const [isCodeValid, setIsCodeValid] = useState<boolean>(true);

	const { canSubmit, reasonWhyError } = useMemo(() => {
		if (snippetName.trim().length === 0) {
			return {
				canSubmit: false,
				reasonWhyError: 'Snippet name cannot be empty!',
			};
		}

		if (!isCodeValid) {
			return {
				canSubmit: false,
				reasonWhyError: 'There are errors in your code!',
			};
		}

		return {
			canSubmit: true,
			reasonWhyError: undefined,
		};
	}, [snippetName, isCodeValid]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!canSubmit) {
			console.log('Skipping submission - form invalid');
			return false;
		}

		console.log('Sending submission');

		apiReviewCode({ code, snippetName });
	};

	const {
		isError,
		error,
		isPending,
		data: response,
		mutate: apiReviewCode,
	} = useMutation({
		mutationFn: async ({
			code,
			snippetName,
		}: {
			code: string;
			snippetName: string;
		}) => {
			const response = await fetchPOST<
				CreateCodeReviewRequestDTO,
				CreateCodeReviewResponseDTO
			>({
				url: '/api/code-review',
				body: { code: code, name: snippetName },
			});

			return response.data;
		},
		onError(error) {
			console.error('Error creating code review', error);
		},
	});

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				width: '90%',
				height: '100%',
			}}
		>
			<h2 style={{ fontWeight: 'normal' }}>Add your code 🧑‍💻</h2>

			<FaintDivider orientation="horizontal" />

			<Grid
				container
				direction="row"
				justifyContent="space-evenly"
				width="100%"
				paddingBottom={0.1}
			>
				<Grid
					size={{ md: 5.5, sm: 12 }}
					display={'flex'}
					flexDirection={'column'}
				>
					<Editor
						height="50vh"
						defaultLanguage="javascript"
						defaultValue='console.log("Hi there 👋")'
						value={code}
						theme={isDark}
						onChange={(value) => setCode(value!)}
						onValidate={(markers) => {
							setIsCodeValid(markers.length === 0);
						}}
					/>

					<form
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
						action="#"
						onSubmit={handleSubmit}
					>
						<TextField
							sx={{ flex: 1 }}
							label="Snipped name"
							variant="outlined"
							onChange={(event) => {
								setSnippetName(event.target.value);
							}}
							error={canSubmit === false}
							helperText={reasonWhyError}
						/>

						<SubmitButton
							disabled={isPending || !canSubmit}
							loading={isPending}
						/>
					</form>
				</Grid>

				<Grid
					size={{ sm: isMdOrSmaller ? 12 : 1 }}
					justifyContent="center"
					display="flex"
				>
					<FaintDivider
						orientation={isMdOrSmaller ? 'horizontal' : 'vertical'}
					/>
				</Grid>

				<Grid size={{ md: 5.5, sm: 12 }}>
					<ResponseBox
						loading={isPending}
						response={
							isError
								? `Error: ${error.message}`
								: response?.review ??
								  'Ask your AI assistant for a review!'
						}
					/>
				</Grid>
			</Grid>
		</div>
	);
}
