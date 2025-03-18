import type { Token } from "./parser";
import { Tokens } from "./subs";
import type { TinyTimeOptions } from "./tinytime";

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
	const s = ["th", "st", "nd", "rd"];
	const v = int % 100;
	const suf = s[(v - 20) % 10] || s[v] || s[0];
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

		const tokenHandlers = {
			[Tokens.UserText]: () => {
				compiled += token[1];
			},
			[Tokens.Day]: () => {
				compiled += suffix(day);
			},
			[Tokens.PartialMonth]: () => {
				compiled += months[month]?.slice(0, 3);
			},
			[Tokens.FullMonth]: () => {
				compiled += months[month];
			},
			[Tokens.NumberMonth]: () => {
				const next = month + 1;
				compiled += options.padMonth ? padWithZeros(next) : `${next}`;
			},
			[Tokens.FullYear]: () => {
				compiled += year;
			},
			[Tokens.PartialYear]: () => {
				compiled += `${year % 100}`;
			},
			[Tokens.DayOfTheWeek]: () => {
				compiled += days[date.getDay()];
			},
			[Tokens.DayOfTheMonth]: () => {
				compiled += options.padDays ? padWithZeros(day) : day;
			},
			[Tokens.Hour]: () => {
				const hour = hours % 12 || 12;
				compiled += options.padHours ? padWithZeros(hour) : hour;
			},
			[Tokens.Hour24]: () => {
				compiled += options.padHours ? padWithZeros(hours) : hours;
			},
			[Tokens.Minutes]: () => {
				compiled += padWithZeros(minutes);
			},
			[Tokens.Seconds]: () => {
				compiled += padWithZeros(seconds);
			},
			[Tokens.PostOrAnteMeridiem]: () => {
				compiled += hours >= 12 ? "PM" : "AM";
			},
		};

		tokenHandlers[token[0]]();

		index++;
	}
	return compiled;
}
