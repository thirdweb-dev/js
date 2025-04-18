import type React from "react";
import { EnsureValidConnectedWalletLoginClient } from "../../components/EnsureValidConnectedWalletLogin/EnsureValidConnectedWalletLoginClient";
import { loginRedirect } from "../../login/loginRedirect";
import { getNebulaLoginStatus } from "../_utils/isLoggedIntoNebula";
import { getSessions } from "./api/session";
import { ChatPageLayout } from "./components/ChatPageLayout";

export default async function Layout(props: {
  children: React.ReactNode;
}) {
  const loginStatus = await getNebulaLoginStatus();

  if (!loginStatus.isLoggedIn) {
    loginRedirect();
  }

  const sessions = await getSessions({
    authToken: loginStatus.authToken,
  }).catch(() => []);

  return (
    <ChatPageLayout
      accountAddress={loginStatus.accountAddress}
      authToken={loginStatus.authToken}
      sessions={sessions}
    >
      {props.children}

      <EnsureValidConnectedWalletLoginClient
        loggedInAddress={loginStatus.accountAddress}
      />
    </ChatPageLayout>
  );
}
