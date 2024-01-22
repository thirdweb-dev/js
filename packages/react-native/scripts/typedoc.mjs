// @ts-check
import { typedoc } from "typedoc-gen";

typedoc({
  entryPoints: ["src/index.ts"],
  exclude: [
    "**/packages/sdk/**",
    "**/packages/wallets/**",
    "**/packages/react-core/**",
    "**/packages/chains/**",
  ],
});
