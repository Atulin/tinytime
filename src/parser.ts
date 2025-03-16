import { SubToTypeIdentifierMap, UserText } from "./subs";

export type Token = [type: string, value?: string];

/**
 * Rather than using a bunch of potentially confusing regular
 * expressions to match patterns in templates, we use a simple
 * parser, taking the approach of a compiler. This is equivalent
 * to a lexer as it returns a stream of tokens. Since there is
 * no additional analysis required for semantics we just call
 * it a parser.
 *
 * It will return an array of tokens, each corresponding to either
 * UserText (just text we want to render) or any number of the
 * substitution types stored in SubToTypeIdentifierMap.
 *
 */
export default function parser(template: string): Token[] {
	const tokens: Token[] = [];
	/**
	 * We iterate through each character in the template string, and track
	 * the index of the character we're processing with `position`. We start
	 * at 0, the first character.
	 */
	let position = 0;
	/**
	 * `text` is used to accumulate what we call "UserText", or simply text that
	 * is not a substitution. For example, in the template:
	 *
	 *  "The day is {day}."
	 *
	 * There are two instances of `UserText`, "The day is " and ".", which is the text
	 * before and after the substitution. With this template our tokens would look something like:
	 *
	 * [
	 *  { type: UserText, value: "The day is "},
	 *  { type : DaySub },
	 *  { type: UserText, value: "." }
	 * ]
	 *
	 */
	let text = "";
	while (position < template.length) {
		let char = template[position++];
		/**
		 * A bracket indicates we're starting a substitution. Any characters after this,
		 * and before the next `}` will be considered part of the substitution name.
		 */
		if (char === "{") {
			// Push any `UserText` we've accumulated and reset the `text` variable.
			if (text) {
				tokens.push([UserText, text]);
			}
			text = "";
			let sub = "";
			char = template[position++];
			while (char !== "}") {
				sub += char;
				char = template[position++];
			}
			const identifier = SubToTypeIdentifierMap[sub];
			if (!identifier) {
				throw new Error(`Unknown substitution: ${sub}`);
			}
			tokens.push([identifier]);
		}
		// Anything not inside brackets is just plain text.
		else {
			text += char;
		}
	}
	/**
	 * We might have some text after we're done iterating through the template if
	 * the template ends with some `UserText`.
	 */
	if (text) {
		tokens.push([UserText, text]);
	}
	return tokens;
}
