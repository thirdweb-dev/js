import { EcosystemLandingPage } from "./EcosystemLandingPage";

export default async function Page() {
  return (
    <EcosystemLandingPage ecosystemLayoutPath="/dashboard/connect/ecosystem" />
  );
}

// because cookies() is used
export const dynamic = "force-dynamic";
