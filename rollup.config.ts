import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const name = "index";

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: (id) => !/^[./]/.test(id),
})

export default [
  bundle({
    plugins: [esbuild({
      minify: process.env.NODE_ENV === "production",
    })],
    output: [
      {
        file: `dist/${name}.js`,
        format: "cjs",
        sourcemap: process.env.NODE_ENV !== "production",
      },
      {
        file: `dist/${name}.mjs`,
        format: "es",
        sourcemap: process.env.NODE_ENV !== "production",
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `dist/${name}.d.ts`,
      format: "es",
    },
  }),
]