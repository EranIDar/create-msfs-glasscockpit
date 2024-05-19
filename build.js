import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['src/index.ts'],
    platform: 'node',
    bundle: true,
    outfile: "dist/index.cjs",
});