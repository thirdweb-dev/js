import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { Suspense } from "react";
import { loginRedirect } from "../../../../(app)/login/loginRedirect";
import {
  getNebulaAuthToken,
  getNebulaAuthTokenWalletAddress,
} from "../../../_utils/authToken";
import { CreateAgentPage } from "./create-agent-page";

export default async function CreateAgentPageRoute() {
  const [authToken, accountAddress] = await Promise.all([
    getNebulaAuthToken(),
    getNebulaAuthTokenWalletAddress(),
  ]);

  if (!authToken || !accountAddress) {
    loginRedirect();
  }

  return (
    <Suspense fallback={<GenericLoadingPage className="border-none" />}>
      <CreateAgentPage authToken={authToken} />
    </Suspense>
  );
}
