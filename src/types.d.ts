export type DateTimeMethods = {
	[K in keyof Date]: Date[K] extends (...args: unknown[]) => number
		? K
		: never;
}[keyof Date];

export type DateParams = [
	year: number,
	monthIndex: number,
	date?: number,
	hours?: number,
	minutes?: number,
	seconds?: number,
	ms?: number,
];

export const dateParamsNames = [
	"year",
	"monthIndex",
	"date",
	"hours",
	"minutes",
	"seconds",
	"ms",
] as const;

export type DateParamsNames = (typeof dateParamsNames)[number];
