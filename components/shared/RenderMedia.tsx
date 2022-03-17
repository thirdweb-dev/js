import { ButtonGroup, Link, Stack, Text } from "@chakra-ui/react";
import { Button } from "components/buttons/Button";

interface IRenderMedia {
  externalUrl: string;
  animationUrl: string;
}

export const RenderMedia: React.FC<IRenderMedia> = ({
  externalUrl,
  animationUrl,
}) => {
  const animationLink = animationUrl?.includes("ipfs://")
    ? animationUrl.replace(
        "ipfs://",
        `${process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL}/` || "",
      )
    : animationUrl;

  const externalLink = externalUrl?.includes("ipfs://")
    ? externalUrl.replace(
        "ipfs://",
        `${process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL}/` || "",
      )
    : externalUrl;

  if (!(externalUrl || animationUrl)) {
    return <Text>N/A</Text>;
  }

  return (
    <Stack as={ButtonGroup} size="sm" variant="outline">
      {animationUrl && (
        <Link href={animationLink} isExternal textDecor="none !important">
          <Button>View Media</Button>
        </Link>
      )}

      {externalUrl && (
        <Link href={externalLink} isExternal textDecor="none !important">
          <Button>View External URL</Button>
        </Link>
      )}
    </Stack>
  );
};
