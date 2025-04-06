'use client';

import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type AppHeaderProps = {
	isDark: boolean;
	toggleDarkMode: () => void;
};

export function AppHeader({ isDark, toggleDarkMode }: AppHeaderProps) {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar
					sx={{
						justifyContent: 'space-between',
					}}
				>
					<div />

					<Typography variant="h6">
						Xintre&apos;s AI Code Reviewer
					</Typography>

					<IconButton onClick={toggleDarkMode}>
						{isDark ? <LightMode /> : <DarkMode />}
					</IconButton>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
