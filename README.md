# ShuffleStack

This React component is to animate reordering of list items.

## Install

```
npm install git+https://github.com/jasonsychau/shufflestack.git
```

## How-To

```
import ShuffleStack from '@jasonsychau/shufflestack'
```

and

```
<ShuffleStack
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

## Notes

Try to not set styles for these:

```
width, position, boxSizing, transform, zIndex for item styles
```

and

```
position, overflowY for list styles
```

They are important to the functioning of the list.
