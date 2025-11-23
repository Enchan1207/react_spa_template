//@ts-check
import esbuild from "esbuild"

await esbuild.build({
    entryPoints: ["src/cli.ts"],
    bundle: true,
    platform: "node",
    banner: {
        js: "#!/usr/bin/env node",
    },
    outfile: "dist/index.js"
})
