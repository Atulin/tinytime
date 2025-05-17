import type { DateParams, DateTimeMethods } from "../types";

export interface DateDelta {
	years?: number;
	months?: number;
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	milliseconds?: number;
}

const methods: [DateTimeMethods, keyof DateDelta][] = [
	["getFullYear", "years"],
	["getMonth", "months"],
	["getDate", "days"],
	["getHours", "hours"],
	["getMinutes", "minutes"],
	["getSeconds", "seconds"],
	["getMilliseconds", "milliseconds"],
] as const;

export const addToDate = (date: Date, delta: DateDelta = {}): Date => {
	return new Date(
		...(methods.map(
			([getter, prop]) =>
				(date[getter] as () => number)() + (delta[prop] ?? 0),
		) as DateParams),
	);
};
