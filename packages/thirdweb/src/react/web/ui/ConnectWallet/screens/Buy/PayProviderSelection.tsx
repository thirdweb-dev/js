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
      center="y"
      color="secondaryText"
      flex="row"
      gap="xxs"
      style={{ padding: spacing.md }}
    >
      <Text size="xs">
        {getProviderLabel(
          props.preferredProvider ?? props.quotedProvider ?? "",
        )}
      </Text>
      {props.supportedProviders.length > 1 && (
        <ChevronDownIcon height={iconSize.sm} width={iconSize.sm} />
      )}
    </Container>
  );

  return (
    <Container
      bg="tertiaryBg"
      borderColor="borderColor"
      flex="row"
      style={{
        alignItems: "center",
        borderBottom: "none",
        borderStyle: "solid",
        borderWidth: "1px",
        justifyContent: "space-between",
        paddingLeft: spacing.md,
      }}
    >
      <Text color="secondaryText" size="xs">
        Provider
      </Text>
      {props.supportedProviders.length > 1 ? (
        <Button
          onClick={props.onShowProviders}
          style={{ padding: 0 }}
          variant="ghost" // Padding is managed within children as the button is conditional
        >
          {ProviderItem}
        </Button>
      ) : (
        ProviderItem
      )}
    </Container>
  );
};
