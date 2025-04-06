'use client';

import Colors from '@/styles/colors';
import { createTheme } from '@mui/material/styles';

export const produceTheme = (isDark: boolean) =>
	createTheme({
		cssVariables: true,
		typography: {
			fontFamily: 'var(--font-geist-sans)',
		},
		palette: {
			mode: isDark ? 'dark' : 'light',
			primary: {
				main: Colors.ROSE,
			},
			background: {
				paper: isDark
					? Colors.BACKGROUND_DARK
					: Colors.BACKGROUND_LIGHT,
			},
		},
	});
