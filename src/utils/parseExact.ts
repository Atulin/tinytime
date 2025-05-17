import type { DateParams, DateParamsNames } from "../types";

type StringToTuple<S extends string> = S extends `${infer Char}${infer Rest}`
	? [Char, ...StringToTuple<Rest>]
	: [];

type StringLength<S extends string> = StringToTuple<S>["length"];

type SameLength<
	A extends string,
	B extends string,
> = StringLength<A> extends StringLength<B>
	? StringLength<B> extends StringLength<A>
		? unknown
		: never
	: never;

export const tokenNames = ["y", "M", "d", "h", "m", "s", "i"] as const;
const tokens: Record<(typeof tokenNames)[number], DateParamsNames> = {
	y: "year",
	M: "monthIndex",
	d: "date",
	h: "hours",
	m: "minutes",
	s: "seconds",
	i: "ms",
} as const;

export function parseExact<D extends string, F extends string>(
	dateString: D,
	format: F & SameLength<D, F>,
): Date;

export function parseExact(dateString: string, format: string): Date {
	const parts: Map<string, string> = new Map();
	let ampm: "am" | "pm" | "" = "";
	const tuples = [...dateString].map((c, i) => [c, format[i]]);

	for (const [c, f] of tuples) {
		if (c === f) continue;
		if (f === "a") {
			ampm += c;
			continue;
		}
		const num = Number.parseInt(c);
		if (Number.isNaN(num)) {
			throw `[${format.indexOf(f)}] ${c} is not a number (format ${f})`;
		}
		parts.set(f, (parts.get(f) ?? "") + c);
	}

	const parsed: [string, number][] = [...parts.entries()].map(([k, v]) => [
		k,
		Number.parseInt(v),
	]);

	const numParts = new Map(parsed);
	if (ampm.toLowerCase() === "pm") {
		numParts.set("h", (numParts.get("h") ?? 12) + 12);
	}

	// JavaScript's stupid ass uses zero-based indexing for months because of-fucking-course it does
	numParts.set("M", (numParts.get("M") ?? 1) - 1);

	const params = Object.keys(tokens).map((k) => numParts.get(k) ?? 0);

	return new Date(...(params as DateParams));
}
