/**
 * We want to represent each sub. type as minimally as possible,
 * so instead of using strings we just use numbers, which lets us
 * represent 27 individual subs. using a single number each.
 */

// biome-ignore lint/suspicious/noConstEnum: <explanation>
export const enum Tokens {
	UserText = 0,
	FullMonth = 1,
	PartialMonth = 2,
	FullYear = 3,
	PartialYear = 4,
	DayOfTheWeek = 5,
	Hour = 6,
	Minutes = 7,
	Seconds = 8,
	PostOrAnteMeridiem = 9,
	Day = 10,
	DayOfTheMonth = 11,
	NumberMonth = 12,
	Hour24 = 13,
}

export const SubToTypeIdentifierMap: {
	[abbreviation: string]: Tokens;
} = {
	MMMM: Tokens.FullMonth,
	MM: Tokens.PartialMonth,
	Mo: Tokens.NumberMonth,
	YYYY: Tokens.FullYear,
	YY: Tokens.PartialYear,
	dddd: Tokens.DayOfTheWeek,
	DD: Tokens.DayOfTheMonth,
	Do: Tokens.Day,
	h: Tokens.Hour,
	H: Tokens.Hour24,
	mm: Tokens.Minutes,
	ss: Tokens.Seconds,
	a: Tokens.PostOrAnteMeridiem,
} as const;
