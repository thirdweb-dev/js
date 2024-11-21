import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import type { Metadata } from "next";
import Link from "next/link";
import ChainValidation from "./ChainValidation";

const title = "Validate Chain";
const description = "Validate a given chain is compatible with thirdweb.";

export const metadata: Metadata = {
  title,
  description,
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <ChakraProviderSetup>
      <div className="container py-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-2xl tracking-tight">
              Validate Chain
            </h1>
            <p>
              Validate a given chain is compatible with{" "}
              <Link
                href="/chainlist"
                className="text-link-foreground hover:text-foreground"
              >
                thirdweb
              </Link>
              .
            </p>
          </div>

          <ChainValidation />
        </div>
      </div>
    </ChakraProviderSetup>
  );
}
