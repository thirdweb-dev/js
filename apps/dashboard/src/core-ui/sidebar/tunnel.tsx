"use client";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import type { ComponentWithChildren } from "types/component-with-children";
import { ClientOnly } from "../../components/ClientOnly/ClientOnly";

export const SIDEBAR_WIDTH = 240;

export const SIDEBAR_TUNNEL_ID = "sidebar-tunnel";

export const SideBarTunnel: ComponentWithChildren = ({ children }) => {
  return (
    <ClientOnly ssr={null}>
      <Portal selector={SIDEBAR_TUNNEL_ID}>{children}</Portal>
    </ClientOnly>
  );
};

type PortalProps = { selector: string };

const Portal: ComponentWithChildren<PortalProps> = ({ children, selector }) => {
  return useMemo(() => {
    const elem = document.getElementById(selector);
    if (elem) {
      return createPortal(children, elem);
    }
    return null;
  }, [children, selector]);
};
