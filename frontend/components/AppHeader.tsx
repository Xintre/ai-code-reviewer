'use client';

import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';

import { BackButton } from './BackButton';

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
					<BackButton />

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
