import * as React from 'react';

export interface ShuffleStackProps extends React.Props<ShuffleStack> {
	items: string[];
	itemStyle?: { [key: string]: string };
	listStyle?: { [key: string]: string };
	itemHeight?: number;
	listWidth?: number;
	animationDuration?: number;
	indexDelay?: number;
}
export type ItemsPair = {
	prevItems: string[];
	nextItems: string[];
}

declare class ShuffleStack extends React.Component<ShuffleStackProps, any> {
}

declare module 'shufflestack' {
}

export default ShuffleStack;
