import { ens, useReleaserProfile } from "../hooks";
import { Box, BoxProps } from "@chakra-ui/react";
import { useMemo } from "react";

interface MaskedAvatarProps
  extends Omit<BoxProps, "as" | "viewBox" | "boxSize"> {
  src: string;
  boxSize?: number;
}

export const MaskedAvatar: React.FC<MaskedAvatarProps> = ({
  src,
  boxSize = 12,
  ...restBoxProps
}) => {
  const stdDeviation = useMemo(() => {
    let d = boxSize / 5;
    if (d < 2) {
      d = 2;
    }
    if (d > 5) {
      d = 5;
    }
    return d;
  }, [boxSize]);

  return (
    <>
      <Box
        boxSize={boxSize}
        {...restBoxProps}
        filter="url(#round)"
        display="grid"
        _before={{
          content: `""`,
          display: "block",
          my: "auto",
          pt: "86.6%",
          background: `url(${src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          clipPath:
            "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        }}
      />
      <Box
        as="svg"
        visibility="hidden"
        position="absolute"
        width="0"
        height="0"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <defs>
          <filter id="round">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={stdDeviation}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </Box>
    </>
  );
};

interface ReleaserAvatar extends Omit<MaskedAvatarProps, "src"> {
  address: string;
}

export const ReleaserAvatar: React.FC<ReleaserAvatar> = ({
  address,
  ...restProps
}) => {
  const ensQuery = ens.useQuery(address);
  const releaserProfile = useReleaserProfile(
    ensQuery.data?.address || undefined,
  );
  return (
    <MaskedAvatar
      src={
        releaserProfile.data?.avatar ||
        `https://source.boringavatars.com/marble/120/${
          ensQuery.data?.ensName || ensQuery.data?.address
        }?colors=264653,2a9d8f,e9c46a,f4a261,e76f51&square=true`
      }
      {...restProps}
    />
  );
};
