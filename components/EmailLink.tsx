import { Link, LinkProps } from "@chakra-ui/react";

interface EmailLinkProps extends Omit<LinkProps, "href" | "isExternal"> {
  email: string;
  subjectLine: string;
  body?: string;
  context?: {
    contractAddress?: string;
    walletAddress?: string;
    projectAddress?: string;
  };
}

function generateEmailBodyFromContext(
  context: EmailLinkProps["context"],
): string {
  if (!context) {
    return "";
  }
  return encodeURIComponent(`

  ------------------- please do not edit below this line -------------------${
    context.projectAddress ? `\nproject address: ${context.projectAddress}` : ""
  }${
    context.walletAddress ? `\nwallet address: ${context.walletAddress}` : ""
  }${
    context.contractAddress
      ? `\ncontract address: ${context.contractAddress}`
      : ""
  }
  `);
}

export const EmailLink: React.FC<EmailLinkProps> = (props) => {
  const { email, subjectLine, body, context, ...rest } = props;

  const _body = body
    ? body
    : context
    ? generateEmailBodyFromContext(context)
    : "";

  const href = `mailto:${email}?subject=${subjectLine}${
    _body ? `&body=${_body}` : ""
  }`;

  return <Link {...rest} href={href} isExternal />;
};
