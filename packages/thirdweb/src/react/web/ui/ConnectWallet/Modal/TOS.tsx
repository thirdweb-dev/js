"use client";
import { spacing } from "../../../../core/design-system/index.js";
import { Container } from "../../components/basic.js";
import { Link } from "../../components/text.js";
import { Text } from "../../components/text.js";
import type { ConnectLocale } from "../locale/types.js";

/**
 * @internal
 */
export function TOS(props: {
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  locale: ConnectLocale["agreement"];
  requireApproval?: boolean;
  isApproved?: boolean;
  onApprove?: () => void;
}) {
  const { termsOfServiceUrl, privacyPolicyUrl, locale, requireApproval } =
    props;

  if (!termsOfServiceUrl && !privacyPolicyUrl && !requireApproval) {
    return null;
  }

  const bothGiven = termsOfServiceUrl && privacyPolicyUrl;

  return (
    <Container flex="row" center="x">
      <Text
        size="xs"
        multiline
        balance
        inline
        center
        style={{
          maxWidth: "250px",
        }}
      >
        {requireApproval && (
          <input
            style={{
              transform: "translateY(3px)",
              marginRight: spacing["3xs"],
            }}
            type="checkbox"
            onChange={props.onApprove}
            checked={props.isApproved}
            disabled={!requireApproval}
          />
        )}
        {locale.prefix}{" "}
        {termsOfServiceUrl && (
          <Link
            inline
            size="xs"
            href={termsOfServiceUrl}
            target="_blank"
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {" "}
            {locale.termsOfService}{" "}
          </Link>
        )}
        {bothGiven && `${locale.and} `}
        {privacyPolicyUrl && (
          <Link inline size="xs" href={privacyPolicyUrl} target="_blank">
            {locale.privacyPolicy}
          </Link>
        )}
        {!privacyPolicyUrl && !termsOfServiceUrl && (
          <Text inline size="xs">
            Terms of Service and Privacy Policy
          </Text>
        )}
      </Text>
    </Container>
  );
}
