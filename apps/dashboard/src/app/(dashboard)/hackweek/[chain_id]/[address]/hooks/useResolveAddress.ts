"use client";

import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useEffect, useState } from "react";
import { isAddress } from "thirdweb";
import { resolveAddress as resolveENSAddress } from "thirdweb/extensions/ens";
import { resolveAddress as resolveLensAddress } from "thirdweb/extensions/lens";

export function useResolveAddress(nameOrAddress: string) {
  const [resolvedAddress, setResolvedAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const client = useThirdwebClient();

  useEffect(() => {
    (async function resolve() {
      if (isAddress(nameOrAddress)) {
        setResolvedAddress(nameOrAddress);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        setResolvedAddress(
          await resolveENSAddress({ client, name: nameOrAddress }),
        );
      } catch {}

      try {
        setResolvedAddress(
          await resolveLensAddress({ client, name: nameOrAddress }),
        );
      } catch {}
    })();
  }, [nameOrAddress, client]);

  return {
    address: resolvedAddress,
    isLoading,
    error,
  };
}
