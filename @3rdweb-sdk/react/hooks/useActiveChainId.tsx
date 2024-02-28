import { Chain } from "@thirdweb-dev/chains";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import invariant from "tiny-invariant";

export type EVMContractInfo = {
  // using null instead of undefined here so that this type can be JSON stringified
  chain: Chain | null;
  chainSlug: string;
  contractAddress: string;
};

type SetEVMContractInfo = (info: EVMContractInfo) => void;

const EVMContractInfoContext = createContext<
  EVMContractInfo | undefined
>(undefined);

const SetEVMContractInfoContext = createContext<
  SetEVMContractInfo | undefined
>(undefined);

// TODO let's move this out of here eventually
export function EVMContractInfoProvider(props: {
  children: React.ReactNode;
  value?: EVMContractInfo;
}) {
  const [value, setValue] = useState<EVMContractInfo | undefined>(props.value);

  // keep the state in sync with the props.value
  // this is required when route changes and page goes from fallback to actual page

  const _setValue = useCallback((info?: EVMContractInfo) => {
    setValue((prevValue) => {
      if (
        prevValue?.chainSlug === info?.chainSlug &&
        prevValue?.contractAddress === info?.contractAddress &&
        info?.chain === null
      ) {
        return prevValue;
      }
      return info;
    });
  }, []);

  useEffect(() => {
    _setValue(props.value);
  }, [_setValue, props.value]);
  // when we move from rendering the fallback page to the actual page, props.value is correct value but state lags behind with undefined value
  // in that case we use the props.value instead of providing undefined and update the state with effect afterwards
  // this only happens ONCE, when the page is not yet created on server. once it is created and cached. value will always be defined
  const providedValue = value || props.value;

  return (
    <EVMContractInfoContext.Provider value={providedValue}>
      <SetEVMContractInfoContext.Provider value={_setValue}>
        {props.children}
      </SetEVMContractInfoContext.Provider>
    </EVMContractInfoContext.Provider>
  );
}

export function useEVMContractInfo() {
  return useContext(EVMContractInfoContext);
}

export function useSetEVMContractInfo() {
  const setter = useContext(SetEVMContractInfoContext);
  invariant(
    setter,
    "useSetEVMContractInfo must be used inside EVMContractInfoProvider",
  );
  return setter;
}

// for EVM - get network info from context
export function useDashboardEVMChainId() {
  const contractInfo = useEVMContractInfo();
  return contractInfo?.chain?.chainId;
}
