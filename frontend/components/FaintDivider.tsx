'use client';

import Colors from '@/styles/colors';
import { Divider } from '@mui/material';

export type orientationType = {
	orientation: 'horizontal' | 'vertical';
};

export function FaintDivider({ orientation }: orientationType) {
	return (
		<Divider
			orientation={orientation}
			style={{
				borderColor: Colors.FAINT_ROSE,
				borderWidth: '0.1em',
				margin: orientation === 'vertical' ? '0 1em' : '0 0 3em 0',
				width: orientation === 'vertical' ? '0%' : '100%',
				height: orientation === 'vertical' ? '100%' : '0%',
				borderStyle: orientation === 'vertical' ? 'dashed' : 'groove',
			}}
		></Divider>
	);
}
