import { ClockIcon } from "@radix-ui/react-icons";
import {
  fontSize,
  iconSize,
  radius,
} from "../../../../../core/design-system/index.js";
import { Skeleton } from "../../../components/Skeleton.js";
import { Container } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import type { IconFC } from "../../icons/types.js";
import { formatSeconds } from "./swap/formatSeconds.js";

export function EstimatedTimeAndFees(props: {
  estimatedSeconds?: number | undefined;
  quoteIsLoading: boolean;
  onViewFees: () => void;
}) {
  const { estimatedSeconds, quoteIsLoading } = props;

  return (
    <Container
      bg="tertiaryBg"
      flex="row"
      borderColor="borderColor"
      style={{
        borderRadius: radius.md,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      <Container flex="row" center="y" gap="xxs" color="accentText" p="sm">
        <ClockIcon width={iconSize.sm} height={iconSize.sm} />
        {quoteIsLoading ? (
          <Skeleton height={fontSize.xs} width="50px" color="borderColor" />
        ) : (
          <Text size="xs" color="secondaryText">
            {estimatedSeconds !== undefined
              ? `~${formatSeconds(estimatedSeconds)}`
              : "--"}
          </Text>
        )}
      </Container>

      <Button variant="ghost" onClick={props.onViewFees} gap="xs">
        <Container color="accentText" flex="row" center="both">
          <ViewFeeIcon size={iconSize.sm} />
        </Container>
        <Text size="xs" color="secondaryText">
          View Fees
        </Text>
      </Button>
    </Container>
  );
}

const ViewFeeIcon: IconFC = (props) => {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9.5 1.5H2.5C1.94772 1.5 1.5 1.94772 1.5 2.5V9.5C1.5 10.0523 1.94772 10.5 2.5 10.5H9.5C10.0523 10.5 10.5 10.0523 10.5 9.5V2.5C10.5 1.94772 10.0523 1.5 9.5 1.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 7.5L7.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
