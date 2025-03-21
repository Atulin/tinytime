
# Tinytime ⏰

> A straightforward date and time formatter in 770 bytes.

[![Publish to NPM and JSR](https://github.com/Atulin/tinytime/actions/workflows/publish.yml/badge.svg)](https://github.com/Atulin/tinytime/actions/workflows/publish.yml)
[![NPM Version](https://img.shields.io/npm/v/%40angius%2Ftinytime)](https://www.npmjs.com/package/@angius/tinytime)
[![JSR Version](https://img.shields.io/jsr/v/%40angius/tinytime?color=f7df1e)](https://jsr.io/@angius/tinytime)
[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

## This fork

* Proper type definitions
* More correct code
* ESM-only

## API

tinytime exports a single function that returns a template object. This object has a single method, `render`, which
takes a `Date` and returns a string with the rendered data.

```js

import { tinytime } from 'tinytime';
const template = tinytime('The time is {h}:{mm}:{ss}{a}.');
template.render(new Date());
// The time is 11:10:20PM.
```

## Substitutions

 * `MMMM` - Full Month (September)
 * `MM` - Partial Month (Sep)
 * `Mo` - Numeric Month (9) <sup>*</sup>
 * `YYYY` - Full Year (1992)
 * `YY` - Partial Year (92)
 * `dddd` - Day of the Week (Monday)
 * `DD` - Day of the Month (24) <sup>*</sup>
 * `Do` - Day (24th)
 * `h` - Hours - 12h format <sup>*</sup>
 * `H` - Hours - 24h format <sup>*</sup>
 * `mm` - Minutes (zero padded)
 * `ss` - Seconds (zero padded)
 * `a` - AM/PM
 
> [!NOTE]
> <sup>*</sup> you can pad them with zeroes (`09` instead of `9`) by passing in the `padMonths`, `padDays`, `padHours` option.
>
> ```js
> const template = tinytime('{Mo}', { padMonth: true })
> ```


## Efficiency

tinytime takes an approach similar to a compiler and generates an AST representing your template. This AST is generated when
you call the main `tinytime` function. This lets you efficiently re-render your template without tinytime having to parse the
template string again. That means its important that you aren't recreating the template object frequently.

Here's an example showing the right and wrong way to use tinytime with React.

Don't do this:

```jsx
function Time({ date }) {
  return (
    <div>
      {tinytime('{h}:{mm}:{ss}{a}').render(date)}
    </div>
  )
}
```

Instead, only create the template object once, and just re-render it.

```jsx
const template = tinytime('{h}:{mm}:{ss}{a}');
function Time({ date }) {
  return (
    <div>
      {template.render(date)}
    </div>
  )
}
```

### Babel Plugins

Using one of the plugins below, you can resolve this efficiency concern at compile time.

[`babel-plugin-transform-tinytime`](http://npm.im/babel-plugin-transform-tinytime) - Hoists `tinytime` calls out of the JSX render scope.

[`babel-plugin-tinytime`](https://www.npmjs.com/package/babel-plugin-tinytime) - Hoists `tinytime` calls out of the current scope, regardless if its inside JSX or an ordinary function scope. 
