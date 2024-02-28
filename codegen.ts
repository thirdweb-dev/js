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
  // emitLegacyCommonJSImports: false,
  // this is annoying, would be better if all of our code was in src/
  documents: ["./graphql/**/*.graphql"],
  generates: {
    "./graphql/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        useTypeImports: true,
        withComponent: false,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
