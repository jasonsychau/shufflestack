import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ShuffleStack from './ShuffleStack';
import { ShuffleStackProps, HTMLPair, ElementPair, JSXElementPair } from './ShuffleStackDataTypes';


class ShuffleStackHTML extends ShuffleStack<ShuffleStackProps<string>, string> {
	isEqualItemsProp(prv: string[], nxt: string[]): boolean {
		return Array.from(prv).every((itm,idx)=>itm===nxt[idx]);
	}
	isEqualItems(fst: string, snd: string): boolean {
		return fst===snd;
	}
	addItemContent(dom: HTMLDivElement, index: number): void {
		dom.innerHTML = this.props.items[index];
	}
}

class ShuffleStackElement extends ShuffleStack<ShuffleStackProps<HTMLElement>, HTMLElement> {
	isEqualItemsProp(prv: HTMLElement[], nxt: HTMLElement[]): boolean {
		return prv.length===nxt.length &&
			Array.from(prv).every((itm,idx)=>itm.isEqualNode(nxt[idx]));
	}
	isEqualItems(fst: HTMLElement, snd: HTMLElement): boolean {
		return fst.isEqualNode(snd);
	}
	addItemContent(dom: HTMLDivElement, index: number): void {
		dom.appendChild(this.props.items[index]);
	}
}

class ShuffleStackKeyValHTML extends ShuffleStack<ShuffleStackProps<HTMLPair>, HTMLPair> {
	isEqualItemsProp(prv: HTMLPair[], nxt: HTMLPair[]): boolean {
		return prv.length===nxt.length &&
			Array.from(prv).every((itm,idx)=>itm.key===nxt[idx].key);
	}
	isEqualItems(fst: HTMLPair, snd: HTMLPair): boolean {
		return fst.key===snd.key;
	}
	addItemContent(dom: HTMLDivElement, index: number): void {
		dom.innerHTML = this.props.items[index].val;
	}	
};

class ShuffleStackKeyValElement extends ShuffleStack<ShuffleStackProps<ElementPair>, ElementPair> {
	isEqualItemsProp(prv: ElementPair[], nxt: ElementPair[]): boolean {
		return prv.length===nxt.length &&
			Array.from(prv).every((itm,idx)=>itm.key===nxt[idx].key);
	}
	isEqualItems(fst: ElementPair, snd: ElementPair): boolean {
		return fst.key===snd.key;
	}
	addItemContent(dom: HTMLDivElement, index: number): void {
		dom.appendChild(this.props.items[index].val);
	}	
};

class ShuffleStackKeyValJSXElement extends ShuffleStack<ShuffleStackProps<JSXElementPair>, JSXElementPair> {
	isEqualItemsProp(prv: JSXElementPair[], nxt: JSXElementPair[]): boolean {
		return prv.length===nxt.length &&
			Array.from(prv).every((itm,idx)=>itm.key===nxt[idx].key);
	}
	isEqualItems(fst: JSXElementPair, snd: JSXElementPair): boolean {
		return fst.key===snd.key;
	}
	addItemContent(dom: HTMLDivElement, index: number): void {
		 ReactDOM.render(this.props.items[index].val, dom);
	}
}

export { ShuffleStackHTML, ShuffleStackElement, ShuffleStackKeyValHTML, ShuffleStackKeyValElement, ShuffleStackKeyValJSXElement };
