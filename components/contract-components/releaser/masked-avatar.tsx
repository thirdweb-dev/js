import { Box, BoxProps } from "@chakra-ui/react";

interface MaskedAvatarProps extends Omit<BoxProps, "as" | "viewBox"> {
  src: string;
}

export const MaskedAvatar: React.FC<MaskedAvatarProps> = ({
  src,
  ...restBoxProps
}) => {
  return (
    <>
      <Box
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
      ></Box>
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
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
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
