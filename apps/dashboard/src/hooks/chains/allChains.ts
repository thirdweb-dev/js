import { AllChainsContext } from "contexts/all-chains";
import { useContext } from "react";
import invariant from "tiny-invariant";

export function useAllChainsData() {
  const data = useContext(AllChainsContext);
  invariant(data, "useAllChains must be used within AllChainsContext");
  return data;
}
