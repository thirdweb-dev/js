import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Img } from "../../components/Img.js";
import { Spacer } from "../../components/Spacer.js";
import type { SelectedTab } from "./types.js";
import { cleanedChainName } from "./utils.js";

export function MobileTabSelector(props: {
  selectedTab: SelectedTab;
  onSelect: (tab: "your-tokens" | "all-tokens" | "chain-selector") => void;
  client: ThirdwebClient;
}) {
  if (props.selectedTab.type === "your-tokens") {
    return <Tabs selectedTab={props.selectedTab} onSelect={props.onSelect} />;
  }

  if (props.selectedTab.type === "chain") {
    return (
      <div>
        <Tabs selectedTab={props.selectedTab} onSelect={props.onSelect} />
        <Spacer y="sm" />
        <Container px="md">
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
            onClick={() => props.onSelect("chain-selector")}
          >
            <Img
              src={props.selectedTab.chain.icon}
              client={props.client}
              width={iconSize.md}
              height={iconSize.md}
            />
            <span> {cleanedChainName(props.selectedTab.chain.name)} </span>
            <ChevronDownIcon
              width={iconSize.sm}
              height={iconSize.sm}
              style={{ marginLeft: "auto" }}
            />
          </Button>
        </Container>
      </div>
    );
  }

  return null;
}

function Tabs(props: {
  selectedTab: SelectedTab;
  onSelect: (tab: "your-tokens" | "all-tokens") => void;
}) {
  const theme = useCustomTheme();
  return (
    <Container
      flex="row"
      gap="xs"
      px="md"
      style={{ borderBottom: `1px solid ${theme.colors.borderColor}` }}
    >
      <TabButton
        isSelected={props.selectedTab.type === "your-tokens"}
        onSelect={() => props.onSelect("your-tokens")}
        label="Your Tokens"
      />
      <TabButton
        isSelected={props.selectedTab.type === "chain"}
        onSelect={() => props.onSelect("all-tokens")}
        label="All Tokens"
      />
    </Container>
  );
}

function TabButton(props: {
  isSelected: boolean;
  onSelect: () => void;
  label: string;
}) {
  const theme = useCustomTheme();
  return (
    <div
      style={{
        paddingBottom: "4px",
        position: "relative",
      }}
    >
      <Button
        variant="ghost-solid"
        onClick={props.onSelect}
        style={{
          fontSize: fontSize.sm,
          padding: `10px ${spacing.xs}`,
          color: props.isSelected
            ? theme.colors.primaryText
            : theme.colors.secondaryText,
        }}
      >
        {props.label}
      </Button>

      {props.isSelected && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "-1.5px",
            borderBottom: `2px solid ${theme.colors.primaryText}`,
          }}
        ></div>
      )}
    </div>
  );
}
