'use client';

import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { AppHeader } from '@/components/AppHeader';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { produceTheme } from '@/utils/theme';

export type AppThemeProviderProps = React.PropsWithChildren;

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
	const [isDark, setIsDark] = useState<boolean>(false);

	const theme = useMemo(() => produceTheme(isDark), [isDark]);

	const toggleDarkMode = useCallback(() => {
		setIsDark((prev) => !prev);
	}, []);

	useLayoutEffect(() => {
		setIsDark(
			window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ??
				false,
		);
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />

			<AppHeader isDark={isDark} toggleDarkMode={toggleDarkMode} />

			{children}
		</ThemeProvider>
	);
};

export default AppThemeProvider;
