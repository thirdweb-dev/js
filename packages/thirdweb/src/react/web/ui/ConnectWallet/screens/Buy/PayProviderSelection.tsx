import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { FiatProvider } from "../../../../../../pay/utils/commonTypes.js";
import { iconSize, spacing } from "../../../../../core/design-system/index.js";
import { Container } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { getProviderLabel } from "./utils.js";

/**
 * Shows the selected payment provider based on the preferred provider OR the quoted provider.
 * @internal
 */
export const PayProviderSelection = (props: {
  onShowProviders: () => void;
  quotedProvider?: FiatProvider;
  preferredProvider?: FiatProvider;
  supportedProviders: FiatProvider[];
}) => {
  const ProviderItem = (
    <Container
      flex="row"
      center="y"
      gap="xxs"
      color="secondaryText"
      style={{ padding: spacing.md }}
    >
      <Text size="xs">
        {getProviderLabel(
          props.preferredProvider ?? props.quotedProvider ?? "",
        )}
      </Text>
      {props.supportedProviders.length > 1 && (
        <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
      )}
    </Container>
  );

  return (
    <Container
      bg="tertiaryBg"
      flex="row"
      borderColor="borderColor"
      style={{
        paddingLeft: spacing.md,
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: "1px",
        borderStyle: "solid",
        borderBottom: "none",
      }}
    >
      <Text size="xs" color="secondaryText">
        Provider
      </Text>
      {props.supportedProviders.length > 1 ? (
        <Button
          variant="ghost"
          onClick={props.onShowProviders}
          style={{ padding: 0 }} // Padding is managed within children as the button is conditional
        >
          {ProviderItem}
        </Button>
      ) : (
        ProviderItem
      )}
    </Container>
  );
};
