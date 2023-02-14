import { createContext, useContext } from "react";
import invariant from "tiny-invariant";
import { DashboardSolanaNetwork } from "utils/solanaUtils";

export type SolanaProgramInfo = {
  network: DashboardSolanaNetwork;
  slug: string;
  programAddress: string;
};

const SolanaProgramContext = createContext<SolanaProgramInfo | undefined>(
  undefined,
);

export const SolanaProgramInfoProvider = SolanaProgramContext.Provider;

export function useSolanaProgramInfo() {
  const data = useContext(SolanaProgramContext);
  invariant(
    data,
    "useSolanaProgramInfo must be used inside SolanaProgramInfoProvider",
  );
  return data;
}
