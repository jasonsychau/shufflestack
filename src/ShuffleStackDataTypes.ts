import * as React from 'react';
import ShuffleStack from './ShuffleStack';


export type StringStringObject = { [key: string]: string };
export interface ShuffleStackProps<IT> extends React.Props<ShuffleStack<ShuffleStackProps<IT>, IT>> {
	items: IT[];
	itemStyle?: StringStringObject;
	listStyle?: StringStringObject;
	itemHeight?: number;
	listWidth?: number;
	listHeight?: number;
	animationDuration?: number;
	indexDelay?: number;
}
export interface ItemsPair<IT> {
	prevItems: IT[];
	nextItems: IT[];
}
export type OptionalNumber = undefined | number;

export type HTMLPair = {
	key: string | number;
	val: string;
};
export type ElementPair = {
	key: string | number;
	val: HTMLElement;
};
export type JSXElementPair = {
	key: string | number;
	val: JSX.Element
}
export type AnimationData = MoveAnimation | MakeAnimation | RemoveAnimation;
interface MoveAnimation {
	type: 'move';
	element: HTMLElement;
	index: number;
	delayIndex: number;
}
interface MakeAnimation {
	type: 'make';
	index: number;
}
interface RemoveAnimation {
	type: 'remove';
	element: HTMLElement;
	delayIndex: number;
}