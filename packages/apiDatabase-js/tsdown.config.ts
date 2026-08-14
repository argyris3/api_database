import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  platform: "browser",
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  deps: {
    neverBundle: ["@apiDatabase/types"],
    alwaysBundle: [
      "socket.io-client",
      "@apiDatabase/constants",
      "uploadthing",
      "uploadthing/client",
    ],
  },
});
