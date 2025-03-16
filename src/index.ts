// @flow
import compiler from "./compiler";
import parser from "./parser";

export type TinyTime = {
	render: (date: Date) => string;
};

export type TinyTimeOptions = {
	padHours?: boolean;
	padDays?: boolean;
	padMonth?: boolean;
};

export const tinytime = (
	template: string,
	options: TinyTimeOptions = {},
): TinyTime => {
	const templateAST = parser(template);
	return {
		render(date: Date) {
			return compiler(templateAST, date, options);
		},
	};
};
