import { BuildAppsButton } from "./build-apps-button";
import { useEVMContractInfo } from "@3rdweb-sdk/react/hooks/useActiveChainId";
import { useAddContractMutation } from "@3rdweb-sdk/react/hooks/useRegistry";
import {
  useContractList,
  useMultiChainRegContractList,
} from "@3rdweb-sdk/react/hooks/useSDK";
import { Icon } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react/evm";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { getDashboardChainRpc } from "lib/rpc";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "tw-components";

const TRACKING_CATEGORY = "add_to_dashboard_upsell";

type AddToDashboardCardProps = {
  contractAddress?: string;
};

export const PrimaryDashboardButton: React.FC<AddToDashboardCardProps> = ({
  contractAddress,
}) => {
  const chain = useEVMContractInfo()?.chain;
  const addContract = useAddContractMutation();
  const trackEvent = useTrack();
  const walletAddress = useAddress();
  const router = useRouter();

  const oldRegistryContractList = useContractList(
    chain?.chainId || -1,
    chain ? getDashboardChainRpc(chain) : "",
    walletAddress,
  );

  const newRegistryContractList = useMultiChainRegContractList(walletAddress);

  const [addedState, setAddedState] = useState<"added" | "removed" | "none">(
    "none",
  );

  const { onSuccess: onAddSuccess, onError: onAddError } = useTxNotifications(
    "Successfully imported",
    "Failed to import",
  );

  const onOldRegistry = useMemo(() => {
    return (
      oldRegistryContractList.isFetched &&
      oldRegistryContractList.data?.find(
        (c) => c.address === contractAddress,
      ) &&
      oldRegistryContractList.isSuccess &&
      // contract can only be on the old registry if we haven't f'd with it
      addedState === "none"
    );
  }, [
    addedState,
    contractAddress,
    oldRegistryContractList.data,
    oldRegistryContractList.isFetched,
    oldRegistryContractList.isSuccess,
  ]);

  const onNewRegistry = useMemo(() => {
    return (
      (newRegistryContractList.isFetched &&
        newRegistryContractList.data?.find(
          (c) => c.address === contractAddress,
        ) &&
        newRegistryContractList.isSuccess) ||
      // if we added it is on the new registry for sure
      addedState === "added"
    );
  }, [
    addedState,
    contractAddress,
    newRegistryContractList.data,
    newRegistryContractList.isFetched,
    newRegistryContractList.isSuccess,
  ]);

  const isAlreadyOnDashboard = useMemo(() => {
    return (onOldRegistry || onNewRegistry) && addedState !== "removed";
  }, [addedState, onNewRegistry, onOldRegistry]);

  const statusUnknown = useMemo(() => {
    return (
      !oldRegistryContractList.isFetched || !newRegistryContractList.isFetched
    );
  }, [newRegistryContractList.isFetched, oldRegistryContractList.isFetched]);

  if (
    !walletAddress ||
    !contractAddress ||
    !chain ||
    router.asPath.includes("payments")
  ) {
    return null;
  }

  return isAlreadyOnDashboard ? (
    <BuildAppsButton>Code Snippets</BuildAppsButton>
  ) : (
    <Button
      minW="inherit"
      variant="solid"
      bg="bgBlack"
      color="bgWhite"
      _hover={{
        opacity: 0.85,
      }}
      _active={{
        opacity: 0.75,
      }}
      leftIcon={<Icon as={FiPlus} />}
      isLoading={addContract.isLoading || statusUnknown}
      isDisabled={!chain?.chainId || isAlreadyOnDashboard}
      onClick={() => {
        if (!chain) {
          return;
        }
        trackEvent({
          category: TRACKING_CATEGORY,
          action: "add-to-dashboard",
          label: "attempt",
          contractAddress,
        });
        addContract.mutate(
          {
            contractAddress,
            chainId: chain.chainId,
          },
          {
            onSuccess: () => {
              onAddSuccess();
              trackEvent({
                category: TRACKING_CATEGORY,
                action: "add-to-dashboard",
                label: "success",
                contractAddress,
              });
              setAddedState("added");
            },
            onError: (err) => {
              onAddError(err);
              trackEvent({
                category: TRACKING_CATEGORY,
                action: "add-to-dashboard",
                label: "error",
                contractAddress,
                error: err,
              });
            },
          },
        );
      }}
    >
      Import contract
    </Button>
  );
};
