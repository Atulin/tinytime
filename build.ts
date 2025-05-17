import { type BuildConfig, Glob } from "bun";
import isolatedDecl from "bun-plugin-isolated-decl";

const config = (min: boolean): BuildConfig => ({
	entrypoints: [
		"./src/tinytime.ts",
		"./src/utils/addToDate.ts",
		"./src/utils/parseExact.ts",
	],
	outdir: "./dist",
	format: "esm",
	naming: min ? "[name].min.[ext]" : "[name].[ext]",
	plugins: min ? [] : [isolatedDecl()],
});

for (const m of [true, false]) {
	await Bun.build({
		...config(m),
		minify: m,
	});
}

const sizes: { file: string; size: number; suffix: string }[] = [];
for await (const file of new Glob("dist/*.js").scan()) {
	const content = await Bun.file(file).arrayBuffer();
	sizes.push({ file, size: content.byteLength, suffix: "bytes" });

	const gzipped = Bun.gzipSync(content);
	sizes.push({ file, size: gzipped.byteLength, suffix: "bytes (GZIP)" });

	const deflated = Bun.deflateSync(content);
	sizes.push({ file, size: deflated.byteLength, suffix: "bytes (DEFLATE)" });
}

const max = sizes.reduce(
	(acc, curr) => {
		acc.file = Math.max(acc.file, curr.file.length);
		acc.size = Math.max(acc.size, curr.size.toString().length);
		return acc;
	},
	{ file: 0, size: 0 },
);

const line = ({ file, size, suffix }: (typeof sizes)[number]) =>
	`${file.padEnd(max.file)} ${size.toString().padEnd(max.size)} ${suffix}`;
const table = sizes.map(line).join("\n");

console.log(table);

const readme = await Bun.file("./README.md").text();
const newReadme = readme.replace(
	/(```x-sizes)[\s\S]*(```)/m,
	`$1\n${table}\n$2`,
);
await Bun.write("./README.md", newReadme);
