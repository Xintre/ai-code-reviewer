'use client';

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	CircularProgress,
	Container,
	Stack,
	Typography,
	useTheme,
} from '@mui/material';
import { useEffect, useMemo } from 'react';

import { Editor } from '@monaco-editor/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaintDivider } from '@/components/FaintDivider';
import { GetCodeReviewListResponseDTO } from '@xintre/shared';
import { fetchGET } from '@/utils/apiClient';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';

export default function ReviewsTable() {
	const theme = useTheme();
	const editorTheme = useMemo(
		() => (theme.palette.mode === 'dark' ? 'vs-dark' : 'light'),
		[theme.palette.mode],
	);

	const {
		isError,
		error,
		isLoading,
		data: response,
	} = useQuery({
		queryKey: ['reviews-list'],
		gcTime: 0, // disable cache - we always want current data
		queryFn: async () => {
			const response = await fetchGET<GetCodeReviewListResponseDTO>({
				url: '/api/code-review/list',
			});

			return response.data;
		},
	});

	useEffect(() => {
		if (isError) {
			console.error('Error getting reviews', error);
		}
	}, [error, isError]);

	return (
		<Container>
			<Stack justifyContent="center" alignItems="center" padding="3rem">
				{isLoading ? (
					<CircularProgress size="5rem" />
				) : isError ? (
					<Typography variant="h4" color="error" textAlign="center">
						Error loading data, please reload page
					</Typography>
				) : (
					<>
						{response?.reviewList.length === 0 && (
							<Typography textAlign="center">
								No Code Reviews exist ⌨️
							</Typography>
						)}

						{response?.reviewList?.map((review) => (
							<Accordion key={review.id}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
								>
									<div
										style={{
											display: 'flex',
											flex: 1,
											justifyContent: 'space-between',
											alignItems: 'center',
										}}
									>
										<Typography
											component="div"
											variant="h6"
										>
											{review.name} ({review.language})
										</Typography>

										<Typography
											component="div"
											variant="caption"
											color="textSecondary"
										>
											{moment(review.createdAt).format(
												'DD.MM.YYYY HH:mm:ss',
											)}
										</Typography>
									</div>
								</AccordionSummary>

								<AccordionDetails>
									<Typography variant="h6">Code:</Typography>
									<Editor
										height="50vh"
										language={review.language}
										value={review.code}
										theme={editorTheme}
										options={{
											readOnly: true,
										}}
									/>

									<FaintDivider orientation="horizontal" />

									<Typography variant="h6">
										Review:
									</Typography>
									{review.review}
								</AccordionDetails>
							</Accordion>
						))}
					</>
				)}
			</Stack>
		</Container>
	);
}
