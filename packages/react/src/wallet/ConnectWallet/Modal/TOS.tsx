import { Container } from "../../../components/basic";
import { Link, Text } from "../../../components/text";

export function TOS(props: {
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
}) {
  const { termsOfServiceUrl, privacyPolicyUrl } = props;

  if (!termsOfServiceUrl && !privacyPolicyUrl) {
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
        By connecting, you agree to the{" "}
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
            Terms of Service{" "}
          </Link>
        )}
        {bothGiven && "& "}
        {privacyPolicyUrl && (
          <Link inline size="xs" href={privacyPolicyUrl} target="_blank">
            Privacy Policy
          </Link>
        )}
      </Text>
    </Container>
  );
}
