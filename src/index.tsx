import * as React from 'react';
var equal = require('deep-equal');

export interface ShuffleStackProps extends React.Props<ShuffleStack> {
	items: string[];
	itemStyle?: { [key: string]: string };
	listStyle?: { [key: string]: string };
	itemHeight?: number;
	listWidth?: number;
	listHeight?: number;
	animationDuration?: number;
	indexDelay?: number;
}
export type ItemsPair = {
	prevItems: string[];
	nextItems: string[];
}

/*
	NOTES:
		- order and presentation is weak to alerts (and similar thread blockers)
		- delay is small wait for one thing to finish
		- important item styles are width, position, boxSizing, transform, zIndex
		- import list styles are position, overflowY
*/
class ShuffleStack extends React.Component<ShuffleStackProps, {}> {
	private readonly delay: number = 1000;
	private readonly myRef = React.createRef<HTMLDivElement>();
	private animationQueue: Array<ItemsPair> = [];
	private prevItems:  string[] = [];
	private prevListStyle: {[key:string]:string} = {};
	private prevItemStyle: {[key:string]:string} = {};

	private itemHeight: number = 50;
	private listWidth: number = 200;
	private listHeight: number = 500;
	private animationDuration: number = 500;
	private indexDelay: number = 100;

	componentDidMount() {
		this.setNextItems();
		this.prevListStyle = Object.assign({}, this.props.listStyle);
		this.prevItemStyle = Object.assign({}, this.props.itemStyle);
		this.animateDataChanges();
	}

	shouldComponentUpdate() {
		return true;
	}

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
			let chgLstStyls: { [key:string]: string } = {};
			if (this.props.listWidth&&this.props.listWidth!==this.delay) {
				this.listWidth = this.props.listWidth;
				let styleWidth = `${this.props.listWidth}px`
				chgLstStyls.minWidth = styleWidth;
				chgLstStyls.maxWidth = styleWidth;
				chgLstStyls.width = styleWidth;
			}
			if (this.props.listHeight&&this.props.listHeight!==this.delay) {
				this.listHeight = this.props.listHeight;
				let styleHeight = `${this.props.listHeight}px`;
				chgLstStyls.height = styleHeight;
				chgLstStyls.minHeight = styleHeight;
				chgLstStyls.maxHeight = styleHeight;
			}
			const nLstStyls = this.props.listStyle
			if (nLstStyls&&!equal(nLstStyls, this.prevListStyle)) {
				this.prevListStyle = Object.assign({}, this.props.listStyle);

				for (const [key, val] of Object.entries(nLstStyls as object)) {
				  	chgLstStyls[key] = val;
				}
			}
			for (const [key, val] of Object.entries(chgLstStyls as object)) {
				(dom as HTMLDivElement).style.setProperty(key, val);
			}

			// change items
			let chgItmStyls: { [key:string]: string } = {};
			if (this.props.itemHeight&&this.props.itemHeight!==this.delay) {
				this.itemHeight = this.props.itemHeight;
				chgItmStyls.height = `${this.props.itemHeight}px`;
			}
			const nItmStyls = this.props.itemStyle;
			if (nItmStyls&&!equal(nItmStyls, this.prevItemStyle)) {
				this.prevItemStyle = Object.assign({}, this.props.itemStyle);

				for (const [key, val] of Object.entries(nItmStyls as object)) {
				  	chgItmStyls[key] = val;
				}
			}
			if (Object.keys(chgItmStyls as object).length>0) {
				let max: number = dom.children.length;
				Array.from(dom.children).forEach((item: Element, index: number)=>{
					this.setDefaultItemStyles(item as HTMLDivElement, index, max);
					for (const [key, val] of Object.entries(chgItmStyls as object)) {
						(item as HTMLDivElement).style.setProperty(key, val);
					}
				});
			}
		}

		if (!equal(this.prevItems,this.props.items)) {
			if (this.animationQueue.length>0) {
				this.setNextItems();
			} else {
				this.setNextItems();
				this.animateDataChanges();
			}
		}
	}

	render() {
		return <div
			ref={this.myRef}
			style={Object.assign(this.getDefaultListStyle()
				,this.props.listStyle) as { [key: string]: string; }}
		></div>
	}

	setNextItems(): void {
		this.animationQueue.push({
			prevItems:this.prevItems,
			nextItems:this.props.items
		});
		this.prevItems = this.props.items.slice(0);
	} 

	setDefaultItemStyles(dom:HTMLDivElement, index:number, max:number) {
		dom.style.borderStyle = 'solid';
		dom.style.borderWidth = '1px';
		dom.style.padding = '10px';
		// dom.style.justifyContent = 'center';
		// dom.style.alignItems = 'center';
		dom.style.zIndex = `${max-index}`;
		dom.style.position = 'absolute';
		dom.style.transform = `translateY(${this.itemHeight*index}px)`;
		let styleHeight: string = `${this.itemHeight}px`;
		dom.style.height = styleHeight;
		dom.style.maxHeight = styleHeight;
		dom.style.minHeight = styleHeight;
		dom.style.width = '100%';
		dom.style.textAlign = 'center';
		dom.style.boxSizing = 'border-box';
		dom.style.backgroundColor = 'white';
	}

	getDefaultListStyle(): {[key:string]:string} {
		let width: string = `${this.listWidth}px`;
		let height: string = `${this.listHeight}px`;
		return {
			width: width,
			minWidth: width,
			maxWidth: width,
			height: height,
			maxheight: height,
			minheight: height,
			position: 'relative',
			overflowY: 'scroll'
		};
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
		this.setDefaultItemStyles(element, index, max);
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

export default ShuffleStack;