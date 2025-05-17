import { describe, expect, it } from "bun:test";
import { addToDate } from "../src/utils/addToDate.js";

describe("addToDate", () => {
	it("Should export a function", () => {
		expect(typeof addToDate).toBe("function");
	});
	it("should add years correctly", () => {
		const date = new Date(2020, 0, 1);
		const result = addToDate(date, { years: 2 });
		expect(result.getFullYear()).toBe(2022);
	});

	it("should add months correctly", () => {
		const date = new Date(2020, 0, 1);
		const result = addToDate(date, { months: 3 });
		expect(result.getMonth()).toBe(3);
	});

	it("should add days correctly", () => {
		const date = new Date(2020, 0, 1);
		const result = addToDate(date, { days: 5 });
		expect(result.getDate()).toBe(6);
	});

	it("should add time units correctly", () => {
		const date = new Date(2020, 0, 1, 12, 0, 0);
		const result = addToDate(date, {
			hours: 2,
			minutes: 30,
			seconds: 15,
		});
		expect(result.getHours()).toBe(14);
		expect(result.getMinutes()).toBe(30);
		expect(result.getSeconds()).toBe(15);
	});

	it("should add milliseconds correctly", () => {
		const date = new Date(2020, 0, 1, 12, 0, 0, 0);
		const result = addToDate(date, { milliseconds: 500 });
		expect(result.getMilliseconds()).toBe(500);
	});

	it("should add multiple units at once", () => {
		const date = new Date(2020, 0, 1);
		const result = addToDate(date, {
			years: 1,
			months: 2,
			days: 3,
			hours: 4,
		});
		expect(result.getFullYear()).toBe(2021);
		expect(result.getMonth()).toBe(2);
		expect(result.getDate()).toBe(4);
		expect(result.getHours()).toBe(4);
	});

	it("should add high amounts multiple units at once", () => {
		const date = new Date(2020, 0, 1);
		const result = addToDate(date, {
			years: 1,
			months: 31,
			days: 78,
			hours: 99,
		});
		expect(result.getFullYear()).toBe(2023);
		expect(result.getMonth()).toBe(9);
		expect(result.getDate()).toBe(22);
		expect(result.getHours()).toBe(3);
	});

	it("should handle empty delta", () => {
		const date = new Date(2020, 0, 1);
		const result = addToDate(date);
		expect(result.getTime()).toBe(date.getTime());
	});
});
