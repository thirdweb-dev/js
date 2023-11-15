import { Container } from "../../../components/basic";
import { Link, Text } from "../../../components/text";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export function TOS(props: {
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
}) {
  const { termsOfServiceUrl, privacyPolicyUrl } = props;
  const locale = useTWLocale().connectWallet.agreement;

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
        {bothGiven && locale.and + " "}
        {privacyPolicyUrl && (
          <Link inline size="xs" href={privacyPolicyUrl} target="_blank">
            {locale.privacyPolicy}
          </Link>
        )}
      </Text>
    </Container>
  );
}
