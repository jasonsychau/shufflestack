import * as React from 'react';
import { ShuffleStackProps, ItemsPair } from '../index';
var equal = require('deep-equal');

/*
	NOTES:
		- order and presentation is weak to alerts (and similar thread blockers)
		- delay is small wait for one thing to finish
		- important item styles are width, position, boxSizing, transform, zIndex
		- import list styles are position, overflowY
*/
export default class ShuffleStack extends React.Component<ShuffleStackProps, {}> {
	private readonly delay: number = 1000;
	private readonly myRef = React.createRef<HTMLDivElement>();
	private animationQueue: Array<ItemsPair> = [];

	private itemHeight: number = 50;
	private listWidth: number = 200;
	private animationDuration: number = 500;
	private indexDelay: number = 100;

	componentDidUpdate(prevProps: ShuffleStackProps) {
		if (this.props.animationDuration&&this.props.animationDuration!==this.delay) {
			this.animationDuration = this.props.animationDuration;
		}
		if (this.props.indexDelay&&this.props.indexDelay!==this.delay) {
			this.indexDelay = this.props.indexDelay;
		}

		const dom = this.myRef.current;
		if (dom) {
			// change list
			if (this.props.listWidth&&this.props.listWidth!==this.delay) {
				this.listWidth = this.props.listWidth;
				(dom as HTMLDivElement).style.width = `{this.props.listWidth}px`;
			}
			const nLstStyls = this.props.listStyle
			if (nLstStyls&&!equal(nLstStyls, prevProps.listStyle)) {
				let keys: string[] = Object.keys(nLstStyls as object);
				keys.forEach((key: string)=>{
					(dom as HTMLDivElement).style.setProperty(key, nLstStyls[key]);
				});
			}

			// change items
			let chgItmStyls: { [key:string]: string } = {};
			if (this.props.itemHeight&&this.props.itemHeight!==this.delay) {
				this.itemHeight = this.props.itemHeight;
				chgItmStyls.height = `{this.props.itemHeight}px`;
			}
			const nItmStyls = this.props.itemStyle;
			if (nItmStyls&&!equal(nItmStyls, prevProps.itemStyle)) {
				let keys: string[] = Object.keys(nItmStyls as object);
				keys.forEach((key: string)=>{
					chgItmStyls[key] = nItmStyls[key];
				});
			}
			if (Object.keys(chgItmStyls).length>0) {
				let keys: string[] = Object.keys(chgItmStyls as object);
				Array.from(dom.children).forEach((item: Element)=>{
					keys.forEach((key: string)=>{
						(item as HTMLDivElement).style.setProperty(key, chgItmStyls[key]);
					});	
				});
			}
		}

		if (!equal(prevProps.items,this.props.items)) {
			if (this.animationQueue.length>0) {
				this.animationQueue.push({
					prevItems:prevProps.items,
					nextItems:this.props.items
				});
			} else {
				console.log("running animation");
				this.animationQueue.push({
					prevItems:prevProps.items,
					nextItems:this.props.items
				})
				this.animateDataChanges();
			}
		}
	}

	render() {
		return <div
			ref={this.myRef}
			style={Object.assign({
				position: 'relative',
				overflowY: 'scroll',
				width: `{this.listWidth}px`
			},this.props.listStyle) as { [key: string]: string; }}
		></div>
	}

	animateDataChanges(): Promise<void> {
		var instanceRef = this;
		return new Promise((resolve, reject) => {
			let {prevItems, nextItems} = instanceRef.animationQueue[0];
			const dom = instanceRef.myRef.current;
			if (dom) {
				// console.log("not equal props")
				let len: number = nextItems.length;
				if (len===0) {
					// make all disappear
					Array.from(dom.children).forEach(item=>{ instanceRef.removeDOMElement(item as HTMLElement); });
					setTimeout(function(){
						Array.from(dom.children ).forEach(item=>{ item.remove(); });
						instanceRef.animationQueue.shift();
						resolve(null);
					},instanceRef.animationDuration+this.delay+this.indexDelay);
				} else {
					// rearrange
					let elementsToRemove: HTMLDivElement[] = [];
					let accountedOldIndices: number[] = [];
					let accountedNewIndices: number[] = [];
					let oldSize: number = prevItems.length;
					let maxSize: number = Math.max(len, oldSize);
					for (let i: number=0;i<len;i++) {
						if (i>=oldSize) {
							if (accountedNewIndices.indexOf(i)===-1) {
								// add new item
								let element = instanceRef.makeNewElement(i,len);
								setTimeout(function() {
									dom.appendChild(element);
								}, i*this.indexDelay);
							}
						} else if (nextItems[i]!==prevItems[i]) {
							// console.log("new "+nextItems[i]+" is not equal to old "+prevItems[i])
							// did i before use this element?
							if (accountedNewIndices.indexOf(i)===-1) {
								// place new item
								let exIdx: number = prevItems.slice(i+1)
									.reduce((acc,curr,ind)=>{
										// console.log('acc is '+acc+' curr is '+curr+' ind is '+ind+' val is '+curr+' vs '+nextItems[i]);
										if (acc===-1&&curr===nextItems[i]&&accountedOldIndices.indexOf(i+1+ind)===-1) {
											return ind;
										} else { return acc; }
									},-1);
								if (exIdx!==-1) {
									exIdx += i+1;
									accountedOldIndices.push(exIdx);
									// console.log("found old "+prevItems[exIdx]+" and putting in new place")

									// move item to correct place
									let element: HTMLDivElement = dom.children[exIdx] as HTMLDivElement;
									
									element.style.zIndex = `${maxSize-i}`;
									instanceRef.moveDOMElement(element as HTMLElement, i);
								} else {
									// add new item
									// console.log("adding new for "+nextItems[i]);
									let element = instanceRef.makeNewElement(i,maxSize);
									setTimeout(function() {
										dom.appendChild(element);
									}, i*this.indexDelay);
								}
							} // else { console.log("new "+nextItems[i]+" is already repositioned"); }

							// is there reference to this element?
							if (accountedOldIndices.indexOf(i)===-1) {
								// reposition old list idx item
								let nIdx: number = nextItems.slice(i+1)
									.reduce((acc,curr,ind)=>{
										if (acc===-1&&curr===prevItems[i]&&accountedNewIndices.indexOf(i+1+ind)===-1) {
											return ind;
										} else { return acc; }
									},-1);
								if (nIdx!==-1) {
									// console.log("found new "+prevItems[i]+" and moving to new position");
									nIdx += i+1;
									accountedNewIndices.push(nIdx);

									// move item to new position
									let element: HTMLDivElement = dom.children[i] as HTMLDivElement;
									accountedOldIndices.push(i);

									element.style.zIndex = `${maxSize-nIdx}`;
									instanceRef.moveDOMElement(element as HTMLElement, nIdx);
								} else { 
									// remove item
									// console.log("removing "+prevItems[i]);
									let element: HTMLDivElement = dom.children[i] as HTMLDivElement;
									instanceRef.removeDOMElement(element as HTMLElement);
									elementsToRemove.push(element);
								}
							} // else { console.log("old "+prevItems[i]+" is already positioned"); }
						} else if (accountedOldIndices.indexOf(i)!==-1) {
							// find another
							let exIdx: number = prevItems.slice(i+1)
								.reduce((acc,curr,ind)=>{
									if (acc===-1&&curr===prevItems[i]&&accountedOldIndices.indexOf(i+1+ind)===-1) {
										return ind;
									} else { return acc; }
								},-1);
							if (exIdx!==-1) {
								exIdx += i+1;
								// move
								let element: HTMLDivElement = dom.children[exIdx] as HTMLDivElement;
								accountedOldIndices.push(exIdx);

								element.style.zIndex = `${maxSize-i}`;
								instanceRef.moveDOMElement(element as HTMLElement, i);
							} else {
								// make new
								let element = instanceRef.makeNewElement(i,maxSize);
								setTimeout(function() {
									dom.appendChild(element);
								}, i*this.indexDelay);
							}
						}
					}
					if (oldSize>len) {
						for (let i: number=len;i<oldSize;i++) {
							if (accountedOldIndices.indexOf(i)===-1) {
								let element: HTMLDivElement = dom.children[i] as HTMLDivElement;
								instanceRef.removeDOMElement(element as HTMLElement);
								elementsToRemove.push(element);
							}
						}
					}

					setTimeout(function(){
						// console.log("swapping positions");
						// const dom = instanceRef.myRef.current;
						// if (dom) {
							elementsToRemove.forEach(elem=>{ dom.removeChild(elem); });

							// https://stackoverflow.com/questions/7742305/changing-the-order-of-elements/7742404#7742404
							const hidden = document.createDocumentFragment();
							const items = Array.from(dom.children) as Array<HTMLDivElement>;
							// console.log("size is "+items.length)
							const sortedList: Array<HTMLDivElement> = items.sort(function(a: HTMLDivElement, b: HTMLDivElement) {
								const c = Number.parseInt(a.style.zIndex,10),
								d = Number.parseInt(b.style.zIndex,10);
								return c>d ? -1 : 1; // larger z-index is first (the are never equal since it is by order)
							});
							// let str = "order is "
							for (let item of sortedList) {
								// str += item.innerHTML + ','
								// dom.insertAdjacentElement('beforeend', item)
								hidden.appendChild(item);
							}
							// console.log(str)
							dom.appendChild(hidden);
							instanceRef.animationQueue.shift();
						// }
						resolve(null);
					}, this.animationDuration+this.delay+len*this.indexDelay);
				}
			} else {
				reject(null);
			}
		}).then(()=>{
			if (instanceRef.animationQueue.length>0) {
				return instanceRef.animateDataChanges();
			} else { return; }
		}).catch(err=>{
			console.error(err.toString());
		});
	}
	removeDOMElement(element: HTMLElement) {
		element.animate([
			{opacity:1},
			{opacity:0}
		], {
			duration: this.animationDuration
		});
		element.style.opacity = '0';
	}
	moveDOMElement(element: HTMLElement, index: number) {
		let newTop: string = `translateY(${this.itemHeight*index}px)`
		element.animate([
			{transform:element.style.transform},
			{transform:newTop}
		],{
			duration:this.animationDuration,
			delay:index*this.indexDelay
		});
		setTimeout(function() {
			element.style.transform = newTop;
		},index*this.indexDelay);
	}
	makeNewElement(index: number,max:number) {
		let element: HTMLDivElement = document.createElement('div');
		element.innerHTML = this.props.items[index];
		element.style.borderStyle = 'solid';
		element.style.borderWidth = '1px';
		element.style.padding = '10px';
		// element.style.justifyContent = 'center';
		// element.style.alignItems = 'center';
		element.style.zIndex = `${max-index}`;
		element.style.position = 'absolute';
		element.style.transform = `translateY(${this.itemHeight*index}px)`;
		element.style.height = `${this.itemHeight}px`;
		element.style.maxHeight = `${this.itemHeight}px`;
		element.style.minHeight = `${this.itemHeight}px`;
		element.style.width = '100%';
		element.style.textAlign = 'center';
		element.style.boxSizing = 'border-box';
		element.style.backgroundColor = 'white';
		const itemStyle = this.props.itemStyle;
		if (itemStyle) {
			Object.keys(itemStyle as object).forEach((key: string)=>{
				element.style.setProperty(key, itemStyle[key]);
			});
		}
		// element.appendChild(this.props.items[i].value);
		element.animate([
			{opacity:0},
			{opacity:1}
		],{
			duration:this.animationDuration,
			delay:index*this.indexDelay
		});
		return element;
	}
}
