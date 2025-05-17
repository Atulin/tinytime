
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
* Additional [utilities](#utils)

## API

Tinytime exports a single function that returns a template object. This object has a single method, `render`, which
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

## Utils

Tinytime now comes with two utility functions exported from `tinytime/utils`

### Date parsing

The `parseExact(string, string)` function can be used to easily parse a date string according to a specified format.

```ts
import { parseExact } from "tinytime/parseExact";

const date = parseExact("05 21 1997 (at 06:37:00 PM)", "MM dd yyyy (at hh:mm:ss aa)");

console.assert(date === new Date("1997-05-21T18:37:00Z")); // assertion passes
```

The format tokens are as follows:

* `y` - year
* `M` - month
* `d` - date
* `h` - hours
* `m` - minutes
* `s` - seconds
* `i` - milliseconds
* `a` - AM/PM

### Date manipulation

The `addToDate(Date, DateDelta)` function can be used to add a desired delta to a given date.

```ts
import { addToDate } from "tinytime/addToDate"

const now = Date.now(); // 2025-05-17T15:08:00.000Z

const future = addToDate(now, { days: 3, years: 100, hours: 761 });

future.toISOString(); // 2125-06-21T08:08:00.000Z
```

The `DateDelta` is defined as follows:

```ts
interface DateDelta {
    years?: number;
    months?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
}
```

## Efficiency

Tinytime takes an approach similar to a compiler and generates an AST representing your template. This AST is generated when
you call the main `tinytime` function. This lets you efficiently re-render your template without Tinytime having to parse the
template string again. That means it's important that you aren't recreating the template object frequently.

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

Instead, only create the template object once and re-render it.

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

## Current bundle size

```x-sizes
dist\addToDate.js      402  bytes
dist\addToDate.js      246  bytes (GZIP)
dist\addToDate.js      228  bytes (DEFLATE)
dist\addToDate.min.js  270  bytes
dist\addToDate.min.js  195  bytes (GZIP)
dist\addToDate.min.js  177  bytes (DEFLATE)
dist\parseExact.js     1083 bytes
dist\parseExact.js     563  bytes (GZIP)
dist\parseExact.js     545  bytes (DEFLATE)
dist\parseExact.min.js 636  bytes
dist\parseExact.min.js 450  bytes (GZIP)
dist\parseExact.min.js 432  bytes (DEFLATE)
dist\tinytime.js       3674 bytes
dist\tinytime.js       1252 bytes (GZIP)
dist\tinytime.js       1234 bytes (DEFLATE)
dist\tinytime.min.js   1278 bytes
dist\tinytime.min.js   771  bytes (GZIP)
dist\tinytime.min.js   753  bytes (DEFLATE)
```

### Babel Plugins

Using one of the plugins below, you can resolve this efficiency concern at compile time.

[`babel-plugin-transform-tinytime`](http://npm.im/babel-plugin-transform-tinytime) - Hoists `tinytime` calls out of the JSX render scope.

[`babel-plugin-tinytime`](https://www.npmjs.com/package/babel-plugin-tinytime) - Hoists `tinytime` calls out of the current scope, regardless if its inside JSX or an ordinary function scope. 
