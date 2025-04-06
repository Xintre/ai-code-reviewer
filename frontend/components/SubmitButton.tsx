'use client';

import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface SubmitButtonProps {
	loading: boolean;
	disabled?: boolean;
}

export function SubmitButton({ loading, disabled = false }: SubmitButtonProps) {
	return (
		<Button
			style={{ margin: '1em', alignSelf: 'flex-end' }}
			variant="outlined"
			startIcon={<SendIcon />}
			loading={loading}
			disabled={disabled || loading}
			type="submit"
		>
			Submit
		</Button>
	);
}
