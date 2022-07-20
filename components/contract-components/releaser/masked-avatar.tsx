import { Box, BoxProps } from "@chakra-ui/react";

interface MaskedAvatarProps extends Omit<BoxProps, "as" | "viewBox"> {
  src: string;
}

export const MaskedAvatar: React.FC<MaskedAvatarProps> = ({
  src,
  ...restBoxProps
}) => {
  return (
    <Box {...(restBoxProps as unknown as any)} as="svg" viewBox="0 0 48 48">
      <mask
        id="mask0"
        // eslint-disable-next-line react/forbid-dom-props
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="1"
        width="48"
        height="46"
      >
        <path
          d="M46.3804 18.089C44.6289 14.4057 42.5865 10.8681 40.2723 7.50957L39.5259 6.43675C38.6069 5.1035 37.4026 3.99168 36.0002 3.18214C34.5979 2.3726 33.0326 1.88564 31.4185 1.75667L30.1081 1.65106C26.0424 1.32465 21.9574 1.32465 17.8919 1.65106L16.5814 1.75667C14.9673 1.88564 13.4022 2.3726 11.9998 3.18214C10.5974 3.99168 9.393 5.1035 8.47406 6.43675L7.72765 7.51917C5.41357 10.8777 3.37106 14.4153 1.61953 18.0986L1.05551 19.2842C0.360566 20.7465 0 22.3453 0 23.9643C0 25.5834 0.360566 27.182 1.05551 28.6444L1.61953 29.83C3.37106 33.5134 5.41357 37.051 7.72765 40.4094L8.47406 41.4919C9.393 42.8251 10.5974 43.937 11.9998 44.7466C13.4022 45.5561 14.9673 46.0431 16.5814 46.1719L17.8919 46.2775C21.9574 46.604 26.0424 46.604 30.1081 46.2775L31.4185 46.1719C33.0338 46.0414 34.5998 45.5522 36.0022 44.7401C37.4047 43.9279 38.6084 42.8133 39.5259 41.4775L40.2723 40.395C42.5865 37.0366 44.6289 33.499 46.3804 29.8156L46.9445 28.63C47.6393 27.1676 48 25.569 48 23.9499C48 22.3309 47.6393 20.7321 46.9445 19.2698L46.3804 18.089Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0)">
        <rect width="48" height="48" fill="url(#pattern0)" />
      </g>
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0"
            transform="translate(-0.0379747) scale(0.00632911)"
          />
        </pattern>
        <image
          width="170"
          height="158"
          id="image0"
          xlinkHref={src}
          mask="url(#svgmask)"
        />
      </defs>
    </Box>
  );
};
