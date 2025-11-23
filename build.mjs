//@ts-check
import esbuild from "esbuild"
import fs from 'fs-extra';
import path from 'path';

await esbuild.build({
    entryPoints: ["src/cli.ts"],
    bundle: true,
    platform: "node",
    banner: {
        js: "#!/usr/bin/env node",
    },
    outfile: "dist/index.js"
})

// テンプレートをコピー
const src = path.resolve('template');
const dest = path.resolve('dist/template');
await fs.copy(src, dest, { overwrite: true });
