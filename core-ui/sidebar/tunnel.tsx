import { createPortal } from "react-dom";
import { ComponentWithChildren } from "types/component-with-children";
import { isBrowser } from "utils/isBrowser";

export const SIDEBAR_WIDTH = 240;

export const SIDEBAR_TUNNEL_ID = "sidebar-tunnel";

export const SideBarTunnel: ComponentWithChildren = ({ children }) => {
  const domElement = isBrowser() && document.getElementById(SIDEBAR_TUNNEL_ID);
  if (!domElement) {
    return null;
  }
  return createPortal(children, domElement);
};
