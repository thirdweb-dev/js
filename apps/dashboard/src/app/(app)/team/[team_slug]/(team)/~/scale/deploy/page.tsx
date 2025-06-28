import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { InfrastructureCheckout } from "./_components/checkout";

export default async function DeployInfrastructurePage() {
  const client = getClientThirdwebClient();

  return <InfrastructureCheckout client={client} />;
}
