import { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_PAYMENTS_API;
const ADMIN_SECRET = process.env.PAYMENTS_ADMIN_SECRET;

if (!API_URL) {
  throw new Error("Missing NEXT_PUBLIC_PAYMENTS_API environment variable");
}
if (!ADMIN_SECRET) {
  throw new Error("Missing PAYMENTS_ADMIN_SECRET environment variable");
}

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [API_URL as string]: {
        headers: {
          "X-Hasura-Admin-Secret": ADMIN_SECRET,
        },
      },
    },
  ],
  // this is annoying, would be better if all of our code was in src/
  documents: ["./graphql/**/*.graphql"],
  generates: {
    "./graphql/generated_types.ts": {
      plugins: ["typescript"],
    },
    "./graphql/__generated__/": {
      preset: "near-operation-file",
      plugins: ["typescript-operations", "typescript-react-apollo"],
      presetConfig: {
        gqlTagName: "gql",
        baseTypesPath: "../generated_types.ts",
        extension: ".generated.ts",
        folder: "../__generated__",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
