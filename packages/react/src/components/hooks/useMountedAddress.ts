import { useAddress } from "../../hooks/useAddress";
import { useIsMounted } from "./useIsMounted";
import { useMemo } from "react";

export function useMountedAddress() {
  const isMounted = useIsMounted();
  const address = useAddress();

  return useMemo(() => {
    return isMounted ? address || null : null;
  }, [address, isMounted]);
}
