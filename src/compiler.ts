import type { TinyTimeOptions } from "./index";
import type { Token } from "./parser";
import {
	Day,
	DayOfTheMonth,
	DayOfTheWeek,
	FullMonth,
	FullYear,
	Hour,
	Hour24,
	Minutes,
	NumberMonth,
	PartialMonth,
	PartialYear,
	PostOrAnteMeridiem,
	Seconds,
	UserText,
} from "./subs";

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
] as const;

const days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
] as const;

/**
 * Takes an integer and returns a string left padded with
 * a zero to the left. Used to display minutes and hours (1:01:00PM);
 */
function padWithZeros(int: number): string {
	return int < 10 ? `0${int}` : `${int}`;
}

/**
 * Adds suffix to day, so 16 becomes 16th.
 */
function suffix(int: number): string {
	const suf =
		int % 10 === 1 && int !== 11
			? "st"
			: int % 10 === 2 && int !== 12
				? "nd"
				: int % 10 === 3 && int !== 13
					? "rd"
					: "th";
	return `${int}${suf}`;
}

/**
 * The compiler takes in our array of tokens returned from the parser
 * and returns the formed template. It just iterates over the tokens and
 * appends some text to the returned string depending on the type of token.
 * @param {Token[]} tokens
 * @param {Date} date
 * @param {TinyTimeOptions} options
 * @returns {String}
 */
export default function compiler(
	tokens: Token[],
	date: Date,
	options: TinyTimeOptions,
): string {
	const month = date.getMonth();
	const year = date.getFullYear();
	const hours = date.getHours();
	const seconds = date.getSeconds();
	const minutes = date.getMinutes();
	const day = date.getDate();
	let compiled = "";
	let index = 0;

	while (index < tokens.length) {
		const token = tokens[index];

		if (!token) {
			break;
		}

		switch (token[0]) {
			case UserText:
				compiled += token[1];
				break;

			case Day:
				compiled += suffix(day);
				break;

			case PartialMonth:
				compiled += months[month]?.slice(0, 3);
				break;

			case FullMonth:
				compiled += months[month];
				break;

			case NumberMonth:
				{
					const next = month + 1;
					compiled += options.padMonth
						? padWithZeros(next)
						: `${next}`;
				}
				break;

			case FullYear:
				compiled += year;
				break;

			case PartialYear:
				compiled += `${year % 100}`;
				break;

			case DayOfTheWeek:
				compiled += days[date.getDay()];
				break;

			case DayOfTheMonth:
				compiled += options.padDays ? padWithZeros(day) : day;
				break;

			case Hour:
				{
					const hour = hours % 12 || 12;
					compiled += options.padHours ? padWithZeros(hour) : hour;
				}
				break;

			case Hour24:
				compiled += options.padHours ? padWithZeros(hours) : hours;
				break;

			case Minutes:
				compiled += padWithZeros(minutes);
				break;

			case Seconds:
				compiled += padWithZeros(seconds);
				break;

			case PostOrAnteMeridiem:
				compiled += hours >= 12 ? "PM" : "AM";
				break;
		}
		index++;
	}
	return compiled;
}
