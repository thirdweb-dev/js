import { getTeams } from "@/api/team";
import type React from "react";
import { getValidAccount } from "../../account/settings/getAccount";
import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "../../api/lib/getAuthToken";
import { loginRedirect } from "../../login/loginRedirect";
import { getSessions } from "./api/session";
import { ChatPageLayout } from "./components/ChatPageLayout";

export default async function Layout(props: {
  children: React.ReactNode;
}) {
  const account = await getValidAccount();
  const authToken = await getAuthToken();

  if (!authToken) {
    loginRedirect();
  }

  const accountAddress = await getAuthTokenWalletAddress();

  if (!accountAddress) {
    loginRedirect();
  }

  const teams = await getTeams();
  const firstTeam = teams?.[0];

  if (!firstTeam) {
    loginRedirect();
  }

  const sessions = await getSessions({
    authToken,
  }).catch(() => []);

  return (
    <ChatPageLayout
      accountAddress={accountAddress}
      authToken={authToken}
      sessions={sessions}
      account={account}
    >
      {props.children}
    </ChatPageLayout>
  );
}
