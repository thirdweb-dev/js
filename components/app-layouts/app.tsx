import { AppShell } from "components/layout/app-shell";
import { NightlyNotice } from "components/notices/NightlyNotice";
import React from "react";
import { ComponentWithChildren } from "types/component-with-children";

export const AppLayout: ComponentWithChildren = ({ children }) => {
  return (
    <>
      <NightlyNotice />
      <AppShell>{children}</AppShell>
    </>
  );
};
