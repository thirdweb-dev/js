import { engineInstancePageHandler } from "../../../_utils/getEngineInstancePageMeta";
import type { EngineInstancePageProps } from "../types";
import { WalletCredentialsSection } from "./components/wallet-credentials";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const { instance, authToken } = await engineInstancePageHandler({
    engineId: params.engineId,
    teamSlug: params.team_slug,
  });

  return (
    <WalletCredentialsSection
      instanceUrl={instance.url}
      authToken={authToken}
    />
  );
}
