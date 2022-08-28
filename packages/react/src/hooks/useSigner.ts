import { Signer } from "ethers";
import { useEffect, useRef } from "react";
import { useAccount, useNetwork, useSigner as useWagmiSigner } from "wagmi";

/**
 *
 * @internal
 */
export function useSigner() {
  const [signer, getSigner] = useWagmiSigner();
  const [account] = useAccount();
  const [network] = useNetwork();

  const _getSignerPromise = useRef<ReturnType<typeof getSigner> | null>(null);

  const address = account.data?.address;
  const chainId = network.data.chain?.id;

  const previousAddress = usePrevious(account.data?.address);
  const previousChainId = usePrevious(network.data?.chain?.id);

  useEffect(() => {
    if (address !== previousAddress || chainId !== previousChainId) {
      if (!_getSignerPromise.current) {
        return;
      } else {
        _getSignerPromise.current = getSigner().finally(() => {
          _getSignerPromise.current = null;
        });
      }
    }
  }, [address, chainId, previousAddress, previousChainId]);

  return Signer.isSigner(signer.data) ? signer.data : undefined;
}

function usePrevious<TVal>(value: TVal): TVal | undefined {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<TVal>();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
