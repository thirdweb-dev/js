import { DeployableContractContractCellProps } from "../../types";
import { Icon, Tooltip } from "@chakra-ui/react";
import { BuiltinContractMap } from "constants/mappings";
import { useTrack } from "hooks/analytics/useTrack";
import { replaceIpfsUrl } from "lib/sdk";
import { BsShieldFillCheck } from "react-icons/bs";
import { LinkButton, TrackedIconButton } from "tw-components";

export const ContractDeployActionCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const trackEvent = useTrack();

  const audit =
    BuiltinContractMap[value as keyof typeof BuiltinContractMap]?.audit;

  return audit ? (
    <Tooltip label="Audited Contract" borderRadius="lg" placement="top">
      <TrackedIconButton
        size="sm"
        as={LinkButton}
        noIcon
        isExternal
        href={replaceIpfsUrl(audit)}
        category="deploy"
        label="audited"
        aria-label="Audited contract"
        colorScheme="green"
        variant="ghost"
        icon={<Icon as={BsShieldFillCheck} boxSize={4} />}
        onClick={(e) => {
          e.stopPropagation();
          trackEvent({
            category: "visit-audit",
            action: "click",
            label: value,
          });
        }}
      />
    </Tooltip>
  ) : null;
};
