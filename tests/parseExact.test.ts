import { describe, expect, it } from "bun:test";
import { parseExact } from "../src/utils/parseExact.js";

describe("parseExact", () => {
	it("Should export a function", () => {
		expect(typeof parseExact).toBe("function");
	});
	it("Should parse an ISO8601 string", () => {
		expect(
			parseExact("2021-07-30T19:07:30.000Z", "yyyy-MM-ddThh:mm:ss.iiiZ"),
		).toEqual(new Date("2021-07-30T19:07:30.000Z"));
	});
	it("Should parse a non-standard", () => {
		expect(
			parseExact("08 03 2019 (18:54:11)", "dd MM yyyy (hh:mm:ss)"),
		).toEqual(new Date("2019-03-08T18:54:11.000Z"));
	});
	it("Should work with the burger time format", () => {
		expect(
			parseExact("07/03/2019 09:27 PM", "MM/dd/yyyy hh:mm aa"),
		).toEqual(new Date("2019-07-03T21:27:00.000Z"));
	});
});
