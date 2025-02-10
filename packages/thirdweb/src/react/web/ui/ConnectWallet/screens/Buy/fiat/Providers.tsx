import {
  type FiatProvider,
  FiatProviders,
} from "../../../../../../../pay/utils/commonTypes.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Link } from "../../../../components/text.js";
/**
 * @internal
 */
export function Providers(props: {
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
      {FiatProviders.map((provider) => {
        return (
          <Container
            key={provider}
            flex="row"
            expand
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
                size="sm"
                hoverColor="primaryText"
              >
                {provider.charAt(0).toUpperCase() +
                  provider.slice(1).toLowerCase()}
              </Link>
            </Button>
          </Container>
        );
      })}
    </Container>
  );
}
