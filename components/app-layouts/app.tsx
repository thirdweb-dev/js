import { AppShell } from "components/layout/app-shell";
import { NightlyNotice } from "components/notices/NightlyNotice";
import React from "react";

export const AppLayout: React.FC = ({ children }) => {
  return (
    <>
      <NightlyNotice />
      <AppShell>{children}</AppShell>
    </>
  );
};
