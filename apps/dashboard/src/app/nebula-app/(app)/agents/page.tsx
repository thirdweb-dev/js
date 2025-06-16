import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { Suspense } from "react";
import { loginRedirect } from "../../../(app)/login/loginRedirect";
import {
  getNebulaAuthToken,
  getNebulaAuthTokenWalletAddress,
} from "../../_utils/authToken";
import { NebulaAgentsPage } from "./nebula-agents-page";

export default async function AgentsPage() {
  const [authToken, accountAddress] = await Promise.all([
    getNebulaAuthToken(),
    getNebulaAuthTokenWalletAddress(),
  ]);

  if (!authToken || !accountAddress) {
    loginRedirect();
  }

  return (
    <Suspense fallback={<GenericLoadingPage className="border-none" />}>
      <NebulaAgentsPage authToken={authToken} />
    </Suspense>
  );
}
