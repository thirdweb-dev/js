import type { FiatProvider } from "../../../../../../../pay/utils/commonTypes.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Link } from "../../../../components/text.js";
import { getProviderLabel } from "../utils.js";
/**
 * @internal
 */

export function Providers(props: {
  supportedProviders: FiatProvider[];
  preferredProvider?: FiatProvider;
  onSelect: (provider: FiatProvider) => void;
}) {
  return (
    <Container
      expand
      flex="column"
      gap="sm"
      style={{
        alignItems: "flex-start",
      }}
    >
      {props.supportedProviders.map((provider) => (
        <Container
          expand
          flex="row"
          key={provider}
          style={{
            justifyContent: "space-between",
          }}
        >
          <Button
            fullWidth
            onClick={() => props.onSelect(provider)}
            variant={"link"}
          >
            <Link
              color={
                props.preferredProvider === provider
                  ? "primaryText"
                  : "secondaryText"
              }
              hoverColor="primaryText"
              size="sm"
            >
              {getProviderLabel(provider)}
            </Link>
          </Button>
        </Container>
      ))}
    </Container>
  );
}
