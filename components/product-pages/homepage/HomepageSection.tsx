import { Box, BoxProps, Container } from "@chakra-ui/react";
import { ComponentWithChildren } from "types/component-with-children";

interface IHomepageSection extends BoxProps {
  id?: string;
  bottomPattern?: true;
  isOverflowXHidden?: boolean;
}

export const HomepageSection: ComponentWithChildren<IHomepageSection> = ({
  children,
  id,
  bottomPattern,
  isOverflowXHidden,
  ...restBoxProps
}) => {
  return (
    <Box
      w="100%"
      position="relative"
      as="section"
      overflow="visible"
      zIndex={2}
      {...restBoxProps}
      overflowX={isOverflowXHidden ? "hidden" : "visible"}
    >
      <Container zIndex={1} position="relative" maxW="container.page" id={id}>
        {children}

        {bottomPattern && (
          <Box
            position="relative"
            zIndex="10"
            pt={24}
            display={{ base: "none", lg: "block" }}
          >
            <Box
              as="svg"
              viewBox="0 0 1371 131"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.12">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1283.29 61.2456L1370.47 107.883L1369.53 109.646L1279.05 61.2456H1087.11L1171.44 125.875L1170.22 127.462L1083.82 61.2456H922.641L975.373 128.246H1368.48V131.246H2.4845V128.246H192.484L279.477 61.2456H75.3353L1.45309 99.0025L0.542969 97.2216L70.9403 61.2456H2.4845V59.2456H74.8539L186.391 2.24561H2.4845V0.245605H1007.18L1007.3 0.0880319L1007.51 0.245605H1168.67L1168.8 0L1169.26 0.245605H1368.48V2.24561H1173L1279.55 59.2456H1368.48V61.2456H1283.29ZM1275.31 59.2456L1168.76 2.24561H1010.12L1084.5 59.2456H1275.31ZM1081.21 59.2456L1006.83 2.24561H876.205L921.067 59.2456H1081.21ZM918.522 59.2456L873.796 2.41838L874.015 2.24561H777.385L797.8 59.2456H918.522ZM795.676 59.2456L775.26 2.24561H603.759L603.9 2.31296L576.697 59.2456H795.676ZM796.392 61.2456L820.389 128.246H543.728L575.742 61.2456H796.392ZM822.513 128.246L798.517 61.2456H920.096L972.828 128.246H822.513ZM187.953 3.69316L187.213 2.24561H356.083L282.073 59.2456H79.2488L187.953 3.69316ZM357.608 3.59496L356.569 2.24561H485.937L440.961 59.2456H285.351L357.608 3.59496ZM488.283 2.50128L487.959 2.24561H601.716L574.481 59.2456H443.508L488.283 2.50128ZM441.93 61.2456H573.525L541.596 128.069L541.964 128.246H389.063L441.93 61.2456ZM439.382 61.2456L386.515 128.246H195.761L282.754 61.2456H439.382Z"
                  fill="url(#paint0_linear_3597_5639)"
                />
              </g>
              <rect
                x="220.999"
                y="59.7456"
                width="931"
                height="1"
                fill="url(#paint1_linear_3597_5639)"
                fillOpacity="0.6"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_3597_5639"
                  x1="1391"
                  y1="65.7452"
                  x2="52.5002"
                  y2="65.7453"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0" />
                  <stop
                    offset="0.403742"
                    stopColor="white"
                    stopOpacity="0.505556"
                  />
                  <stop offset="0.479167" stopColor="white" stopOpacity="0.6" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_3597_5639"
                  x1="184.406"
                  y1="62.9607"
                  x2="184.556"
                  y2="72.6672"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#191A1B" />
                  <stop offset="0.3125" stopColor="#18434E" />
                  <stop offset="0.697917" stopColor="#6C2F73" />
                  <stop offset="1" stopColor="#191A1B" />
                </linearGradient>
              </defs>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};
