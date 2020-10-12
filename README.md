# ShuffleStack

This React component is to animate reordering of list items.

## Install

```
npm install git+https://github.com/jasonsychau/shufflestack.git
```

## How-To

There are five types for different inputs:

1. [string or HTML](#string-or-HTML)
2. [HTMLElement input](#htmlelement)
3. [string or HTML by key-value](#key-value-string-or-html)
4. [HTMLElement by key-value](#key-value-htmlelement)
5. [JSX.Element by key-value](#key-value-jsx)

### String or HTML

```
import { ShuffleStackHTML } from '@jasonsychau/shufflestack'
```

and

```
<ShuffleStackHTML
	items={ string[] }
	itemHeight={ number } // (optional) static item height
	listWidth={ number } // (optional) static list width
	listHeight={ number } // (optional) static list height (list is scrollable)
	animationDuration={ number } // (optional) in milliseconds
	indexDelay={ number } // (optional) delay between the start of animation after the item before in ms
	itemStyle={ {[key: string]: string;} } // (optional) styles applied to items after defaults
	listStyle={ {[key: string]: string;} } // (optional) style applied to list after defaults
/>
```

The input is set with .innerHTML setter.

Larger, and constant, strings are better with ShuffleStackKeyValHTML.

### HTMLElement

```
import { ShuffleStackElement } from '@jasonsychau/shufflestack'
```

and

```
<ShuffleStackElement
	items={ HTMLElement[] }
	itemHeight={ number } // (optional) static item height
	listWidth={ number } // (optional) static list width
	listHeight={ number } // (optional) static list height (list is scrollable)
	animationDuration={ number } // (optional) in milliseconds
	indexDelay={ number } // (optional) delay between the start of animation after the item before in ms
	itemStyle={ {[key: string]: string;} } // (optional) styles applied to items after defaults
	listStyle={ {[key: string]: string;} } // (optional) style applied to list after defaults
/>
```

The input is set with Node.appendChild(INPUT).

This is for smaller HTMLElement(s). Larger, and constant, elements are better with the ShuffleStackKeyValElement.

### Key Value String or HTML

```
import { ShuffleStackKeyValHTML } from '@jasonsychau/shufflestack'
```

and

```
<ShuffleStackKeyValHTML
	items={ {
		key: string | number;
		val: string;
	}[] }
	itemHeight={ number } // (optional) static item height
	listWidth={ number } // (optional) static list width
	listHeight={ number } // (optional) static list height (list is scrollable)
	animationDuration={ number } // (optional) in milliseconds
	indexDelay={ number } // (optional) delay between the start of animation after the item before in ms
	itemStyle={ {[key: string]: string;} } // (optional) styles applied to items after defaults
	listStyle={ {[key: string]: string;} } // (optional) style applied to list after defaults
/>
```

Input is set by .innerHTML setter.

Only the first input is displayed: if the value is later changed for the same key, the previous value is shown (unless this key is removed before re-entering).

### Key Value HTMLElement

```
import { ShuffleStackKeyValElement } from '@jasonsychau/shufflestack'
```

and

```
<ShuffleStackKeyValElement
	items={ {
		key: string | number;
		val: HTMLElement;
	}[] }
	itemHeight={ number } // (optional) static item height
	listWidth={ number } // (optional) static list width
	listHeight={ number } // (optional) static list height (list is scrollable)
	animationDuration={ number } // (optional) in milliseconds
	indexDelay={ number } // (optional) delay between the start of animation after the item before in ms
	itemStyle={ {[key: string]: string;} } // (optional) styles applied to items after defaults
	listStyle={ {[key: string]: string;} } // (optional) style applied to list after defaults
/>
```

Input is set with Node.appendChild(INPUT).

Only the first input is displayed: if the value is later changed for the same key, the previous value is shown (unless this key is removed before re-entering).

### Key Value JSX

```
import { ShuffleStackKeyValJSXElement } from '@jasonsychau/shufflestack'
```

and

```
<ShuffleStackKeyValJSXElement
	items={ {
		key: string | number;
		val: JSX.Element;
	}[] }
	itemHeight={ number } // (optional) static item height
	listWidth={ number } // (optional) static list width
	listHeight={ number } // (optional) static list height (list is scrollable)
	animationDuration={ number } // (optional) in milliseconds
	indexDelay={ number } // (optional) delay between the start of animation after the item before in ms
	itemStyle={ {[key: string]: string;} } // (optional) styles applied to items after defaults
	listStyle={ {[key: string]: string;} } // (optional) style applied to list after defaults
/>
```

Input is set with ReactDOM.render(INPUT, Node). An example JSX.Element is

```
const input = <ELEMENT_NAME>{JSX.Element | JSX.Element[]}</ELEMENT_NAME>;
```

or

```
const component = (props) => <ELEMENT_NAME>{JSX.Element | JSX.Element[]}</ELEMENT_NAME>;

const input = component();
```

Only the first input is displayed: if the value is later changed for the same key, the previous value is shown (unless this key is removed before re-entering).

## Notes

Avoid over-writing width, position, boxSizing, transform, zIndex for item styles

Avoid over-writing position, overflowY for list styles