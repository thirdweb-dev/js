import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { Suspense } from "react";
import { loginRedirect } from "../../../(app)/login/loginRedirect";
import {
  getNebulaAuthToken,
  getNebulaAuthTokenWalletAddress,
} from "../../_utils/authToken";
import { NebulaSettingsPage } from "./nebula-settings-page";

export default async function SettingsPage() {
  const [authToken, accountAddress] = await Promise.all([
    getNebulaAuthToken(),
    getNebulaAuthTokenWalletAddress(),
  ]);

  if (!authToken || !accountAddress) {
    loginRedirect();
  }

  return (
    <Suspense fallback={<GenericLoadingPage className="border-none" />}>
      <NebulaSettingsPage />
    </Suspense>
  );
}
