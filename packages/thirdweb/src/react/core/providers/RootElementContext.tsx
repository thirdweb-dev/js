import { createContext } from "react";
import type { ConnectionManager } from "../../../wallets/manager/index.js";

export const SetRootElementContext = createContext<
  (el: React.ReactNode) => void
>(() => {});

export const ConnectionManagerContext = createContext<ConnectionManager | null>(
  null,
);
