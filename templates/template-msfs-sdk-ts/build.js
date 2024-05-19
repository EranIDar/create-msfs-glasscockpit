import { build, context } from "esbuild";
import { copy } from "esbuild-plugin-copy";

const mode = process.env.ENV;

const config = {
  entryPoints: ["src/main.tsx"],
  platform: "node",
  bundle: true,
  sourcemap: mode == "dev",
  outfile: "dist/main.js",
  plugins: [
    copy({
      assets: {
        from: ["./src/index.html", "./src/styles.css"],
        to: ["."],
      },
    }),
    copy({
      assets: {
        from: ["./src/assets/*"],
        to: ["assets"],
      },
    }),
  ],
};

if (mode == "watch") {
  let ctx = await context(config);
  await ctx.watch();
} else {
  await build(config);
}
