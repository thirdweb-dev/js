import type React from "react";
import { getNebulaLoginStatus } from "@/utils/isLoggedIntoNebula";
import { loginRedirect } from "@/utils/loginRedirect";
import { getSessions } from "./api/session";
import { ChatPageLayout } from "./components/ChatPageLayout";

export default async function Layout(props: { children: React.ReactNode }) {
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
    </ChatPageLayout>
  );
}
