import { type BuildConfig, Glob } from "bun";

const config = (min: boolean): BuildConfig => ({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	format: "esm",
	naming: min ? "[dir]/tinytime.min.[ext]" : "[dir]/tinytime.[ext]",
});

for (const m of [true, false]) {
	await Bun.build({
		...config(m),
		minify: m,
	});
}

for await (const file of new Glob("dist/*.js").scan()) {
	const content = await Bun.file(file).arrayBuffer();
	console.log(`${file} ${content.byteLength} bytes`);

	const gzipped = Bun.gzipSync(content);
	console.log(`${file} ${gzipped.byteLength} bytes (GZIP)`);

	const deflated = Bun.deflateSync(content);
	console.log(`${file} ${deflated.byteLength} bytes (DEFLATE)`);
}
