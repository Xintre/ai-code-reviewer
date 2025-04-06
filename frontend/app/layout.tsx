import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import AppThemeProvider from '@/components/providers/AppThemeProvider';
import { Geist } from 'next/font/google';
import type { Metadata } from 'next';
import { Stack } from '@mui/material';
import { TanstackQueryProvider } from '@/components/providers/TanstackQueryProvider';
import moment from 'moment';

moment.locale('pl');

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'AI Code Reviewer',
	description: 'An AI-backed code review utility',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
				/>
			</head>

			<body className={geistSans.variable}>
				<TanstackQueryProvider>
					<AppRouterCacheProvider>
						<AppThemeProvider>
							<Stack
								spacing={2}
								width={'100%'}
								display={'flex'}
								alignItems={'center'}
							>
								{children}
							</Stack>
						</AppThemeProvider>
					</AppRouterCacheProvider>
				</TanstackQueryProvider>
			</body>
		</html>
	);
}
