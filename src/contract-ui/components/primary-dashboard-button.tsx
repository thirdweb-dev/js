import { BuildAppsButton } from "./build-apps-button";
import { useEVMContractInfo } from "@3rdweb-sdk/react/hooks/useActiveChainId";
import {
  useAddContractMutation,
  useAllContractList,
} from "@3rdweb-sdk/react/hooks/useRegistry";
import { Icon } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react/evm";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useRouter } from "next/router";
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

  const registry = useAllContractList(walletAddress);

  const { onSuccess: onAddSuccess, onError: onAddError } = useTxNotifications(
    "Successfully imported",
    "Failed to import",
  );

  const isInRegistry =
    registry.isFetched &&
    registry.data?.find(
      (c) =>
        contractAddress &&
        c.address.toLowerCase() === contractAddress.toLowerCase(),
    ) &&
    registry.isSuccess;

  if (
    !walletAddress ||
    !contractAddress ||
    !chain ||
    router.asPath.includes("payments")
  ) {
    return null;
  }

  return isInRegistry ? (
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
      isLoading={addContract.isLoading}
      isDisabled={!chain?.chainId}
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
