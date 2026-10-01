import type { Metadata } from "next";
import { getAuthToken } from "@/api/auth-token";
import { loginRedirect } from "@/utils/redirects";
import { ChainIntegrationRequestForm } from "./chain-integration-request-form";

export const metadata: Metadata = {
  title: "Mainnet Chain Integration Request",
};

export default async function ChainIntegrationRequestPage() {
  const authToken = await getAuthToken();
  if (!authToken) {
    loginRedirect("/chainlist/request");
  }

  return (
    <section className="container mx-auto flex max-w-2xl flex-col px-4 py-10">
      <h1 className="font-semibold text-3xl tracking-tight">
        Mainnet Chain Integration Request
      </h1>
      <p className="mt-2 text-muted-foreground">
        Share your chain details and our team will get back to you.
      </p>
      <div className="mt-8">
        <ChainIntegrationRequestForm />
      </div>
    </section>
  );
}
