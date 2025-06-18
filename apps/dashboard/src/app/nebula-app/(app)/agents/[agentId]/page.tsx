import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { Suspense } from "react";
import { loginRedirect } from "../../../../(app)/login/loginRedirect";
import {
  getNebulaAuthToken,
  getNebulaAuthTokenWalletAddress,
} from "../../../_utils/authToken";
import AgentPage from "./agent-page";

export default async function AgentPageRoute({
  params,
}: { params: Promise<{ agentId: string }> }) {
  const [authToken, accountAddress] = await Promise.all([
    getNebulaAuthToken(),
    getNebulaAuthTokenWalletAddress(),
  ]);

  const { agentId } = await params;

  if (!authToken || !accountAddress || !agentId) {
    loginRedirect();
  }

  return (
    <Suspense fallback={<GenericLoadingPage className="border-none" />}>
      <AgentPage authToken={authToken} agentId={agentId} />
    </Suspense>
  );
}
