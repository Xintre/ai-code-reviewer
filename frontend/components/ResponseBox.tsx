import { Paper, Skeleton, Typography } from '@mui/material';

export type ResponseBoxType = {
	loading: boolean;
	response: string;
};

export function ResponseBox({ loading, response }: ResponseBoxType) {
	return (
		<Paper
			sx={{
				flex: 1,
				padding: '1em',
				display: 'flex',
				justifyContent: 'left',
				alignItems: 'top',
				overflow: 'hidden',
				flexDirection: 'column',
			}}
		>
			{loading ? (
				<>
					<Skeleton width="100%" animation="wave" />
					<Skeleton width="100%" animation="wave" />
					<Skeleton width="100%" animation="wave" />
					<Skeleton width="22%" animation="wave" />
				</>
			) : (
				<Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
					{response}
				</Typography>
			)}
		</Paper>
	);
}
