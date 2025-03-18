import compiler from "./compiler";
import parser from "./parser";

export type TinyTime = {
	/**
	 * Renders the template with the provided date.
	 *
	 * @param {Date} date - The date to render the template with.
	 * @returns {string} - The rendered string with the date substitutions.
	 */
	render: (date: Date) => string;
};

export type TinyTimeOptions = {
	padHours?: boolean;
	padDays?: boolean;
	padMonth?: boolean;
};

/**
 * Creates a template object from a template string.
 *
 * The following substitutions are supported:
 * | Token | Description |
 * | --- | --- |
 * | `MMMM` | Full Month (September) |
 * | `MM` | Partial Month (Sep) |
 * | `Mo` | Numeric Month (9) |
 * | `YYYY` | Full Year (1992) |
 * | `YY` | Partial Year (92) |
 * | `dddd` | Day of the Week (Monday) |
 * | `DD` | Day of the Month (24) |
 * | `Do` | Day (24th) |
 * | `h` | Hours - 12h format |
 * | `H` | Hours - 24h format |
 * | `mm` | Minutes (zero padded) |
 * | `ss` | Seconds (zero padded) |
 * | `a` | AM/PM |
 *
 * @param {string} template a template string
 * @param {TinyTimeOptions} options an object with options
 * @returns {TinyTime} a TinyTime object with a render method
 */
export const tinytime = (
	template: string,
	options: TinyTimeOptions = {},
): TinyTime => {
	const templateAST = parser(template);
	return {
		render(date: Date): string {
			return compiler(templateAST, date, options);
		},
	};
};
