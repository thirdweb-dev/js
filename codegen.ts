import { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config();

const config: CodegenConfig = {
  overwrite: true,
  schema: "./graphql/schema.json",
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
