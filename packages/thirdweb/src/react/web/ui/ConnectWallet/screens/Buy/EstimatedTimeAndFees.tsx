import { ClockIcon } from "@radix-ui/react-icons";
import {
  fontSize,
  iconSize,
  radius,
} from "../../../../../core/design-system/index.js";
import { Container } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Skeleton } from "../../../components/Skeleton.js";
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
      borderColor="borderColor"
      flex="row"
      style={{
        alignItems: "center",
        borderRadius: radius.md,
        borderStyle: "solid",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderWidth: "1px",
        justifyContent: "space-between",
      }}
    >
      <Container center="y" color="accentText" flex="row" gap="xxs" p="sm">
        <ClockIcon height={iconSize.sm} width={iconSize.sm} />
        {quoteIsLoading ? (
          <Skeleton color="borderColor" height={fontSize.xs} width="50px" />
        ) : (
          <Text color="secondaryText" size="xs">
            {estimatedSeconds !== undefined
              ? `~${formatSeconds(estimatedSeconds)}`
              : "--"}
          </Text>
        )}
      </Container>

      <Button gap="xs" onClick={props.onViewFees} variant="ghost">
        <Container center="both" color="accentText" flex="row">
          <ViewFeeIcon size={iconSize.sm} />
        </Container>
        <Text color="secondaryText" size="xs">
          View Fees
        </Text>
      </Button>
    </Container>
  );
}

const ViewFeeIcon: IconFC = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={props.size}
      viewBox="0 0 12 12"
      width={props.size}
      xmlns="http://www.w3.org/2000/svg"
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
