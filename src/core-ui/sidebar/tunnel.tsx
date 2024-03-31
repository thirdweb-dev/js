import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ComponentWithChildren } from "types/component-with-children";

export const SIDEBAR_WIDTH = 240;

export const SIDEBAR_TUNNEL_ID = "sidebar-tunnel";

export const SideBarTunnel: ComponentWithChildren = ({ children }) => {
  return (
    <ClientOnlyPortal selector={SIDEBAR_TUNNEL_ID}>{children}</ClientOnlyPortal>
  );
};

type ClientOnlyPortalProps = { selector: string };

const ClientOnlyPortal: ComponentWithChildren<ClientOnlyPortalProps> = ({
  children,
  selector,
}) => {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.getElementById(selector);
    setMounted(true);
  }, [selector]);

  return mounted && ref.current ? createPortal(children, ref.current) : null;
};
