const esbuild = require("esbuild");
const plugin = require("node-stdlib-browser/helpers/esbuild/plugin");
const stdLibBrowser = require("node-stdlib-browser");

// const DIST_PATH = path.resolve(process.cwd(), "dist/");

// fs.rmSync(DIST_PATH, { recursive: true, force: true });

["evm", "solana"].forEach((ecosystem) => {
  esbuild.build({
    jsx: "automatic",
    entryPoints: [`src/thirdweb-bridge-${ecosystem}.ts`],
    bundle: true,
    minify: true,
    platform: "browser",
    target: "es2020",
    outfile: `dist/thirdweb-unity-bridge-${ecosystem}.js`,
    splitting: false,
    write: true,
    sourcemap: false,
    inject: [require.resolve("node-stdlib-browser/helpers/esbuild/shim")],
    define: {
      process: JSON.stringify({
        env: "production",
      }),
      Buffer: "Buffer",
    },
    plugins: [plugin(stdLibBrowser)],
  });
});
