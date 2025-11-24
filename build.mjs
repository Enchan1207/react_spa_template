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

/**
 * @param {string} pattern 
 * @returns {Promise<string[]>}
 */
const glob = (pattern) => new Promise((resolve, reject) => fs.glob(pattern, (err, matches) => err !== null ? reject(err) : resolve(matches)))

// 不要ファイルのクリーンアップ
const cleanupPatterns = [
    "template/**/node_modules",
    "template/pnpm-lock.yaml",
]
await Promise.allSettled(cleanupPatterns.map(async (pattern) => {
    const entries = await glob(pattern)
    await Promise.allSettled(entries.map((entry) => fs.remove(entry)))
}))

// テンプレートをコピー
const src = path.resolve('template');
const dest = path.resolve('dist/template');
await fs.copy(src, dest, { overwrite: true });
