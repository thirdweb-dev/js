"use client";
import { spacing } from "../../../../core/design-system/index.js";
import { Container } from "../../components/basic.js";
import { Link, Text } from "../../components/text.js";
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
    <Container center="x" flex="row">
      <Text
        balance
        center
        inline
        multiline
        size="xs"
        style={{
          maxWidth: "250px",
        }}
      >
        {requireApproval && (
          <input
            checked={props.isApproved}
            disabled={!requireApproval}
            onChange={props.onApprove}
            style={{
              marginRight: spacing["3xs"],
              transform: "translateY(3px)",
            }}
            type="checkbox"
          />
        )}
        {locale.prefix}{" "}
        {termsOfServiceUrl && (
          <Link
            href={termsOfServiceUrl}
            inline
            size="xs"
            style={{
              whiteSpace: "nowrap",
            }}
            target="_blank"
          >
            {" "}
            {locale.termsOfService}{" "}
          </Link>
        )}
        {bothGiven && `${locale.and} `}
        {privacyPolicyUrl && (
          <Link href={privacyPolicyUrl} inline size="xs" target="_blank">
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
