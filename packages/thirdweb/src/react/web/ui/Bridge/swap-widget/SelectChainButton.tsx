import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { BridgeChain } from "../../../../../bridge/types/Chain.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { Button } from "../../components/buttons.js";
import { Img } from "../../components/Img.js";
import { cleanedChainName } from "./utils.js";

export function SelectChainButton(props: {
  selectedChain: BridgeChain;
  client: ThirdwebClient;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      bg="tertiaryBg"
      fullWidth
      style={{
        justifyContent: "flex-start",
        fontWeight: 500,
        fontSize: fontSize.md,
        padding: `${spacing.sm} ${spacing.sm}`,
        borderRadius: radius.lg,
        minHeight: "48px",
      }}
      gap="sm"
      onClick={props.onClick}
    >
      <Img
        src={props.selectedChain.icon}
        client={props.client}
        width={iconSize.lg}
        height={iconSize.lg}
      />
      <span> {cleanedChainName(props.selectedChain.name)} </span>

      <ChevronDownIcon
        width={iconSize.sm}
        height={iconSize.sm}
        style={{ marginLeft: "auto" }}
      />
    </Button>
  );
}
