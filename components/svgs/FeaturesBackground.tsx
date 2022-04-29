import Icon from "@chakra-ui/icon";
import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

export const FeaturesBackground: React.FC<FlexProps> = (props) => {
  return (
    <Flex
      {...props}
      bg="backgroundDark"
      clipPath={{
        base: "polygon(0 0, 100% 4%, 100% 100%, 0% 100%)",
        md: "polygon(0 0, 100% 25%, 100% 100%, 0% 100%)",
      }}
      h="100%"
      w="100%"
      align="flex-end"
    >
      <Icon
        position="absolute"
        left="50%"
        transform="translateX(-50%)"
        h="auto"
        flexGrow={1}
        w={{ base: "300vw", md: "100vw" }}
        maxW="1920px"
        as="svg"
        viewBox="0 0 1920 774"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 773.258h1920"
          stroke="url(#paint0_linear_1641:2314)"
          strokeOpacity={0.3}
        />
        <path
          d="M0 583.361h1920"
          stroke="url(#paint1_linear_1641:2314)"
          strokeOpacity={0.3}
        />
        <path
          d="M206 773l242-190"
          stroke="url(#paint2_linear_1641:2314)"
          strokeOpacity={0.3}
        />
        <path
          d="M467 773l161-189"
          stroke="url(#paint3_linear_1641:2314)"
          strokeOpacity={0.3}
        />
        <path
          d="M666 774l97-190"
          stroke="url(#paint4_linear_1641:2314)"
          strokeOpacity={0.3}
        />
        <path
          d="M826 774l60-190"
          stroke="url(#paint5_linear_1641:2314)"
          strokeOpacity={0.3}
        />
        <path
          d="M1484 583l230 190"
          stroke="url(#paint6_linear_1641:2314)"
          strokeOpacity={0.3}
        />
        <path
          d="M973 586v188"
          stroke="url(#paint7_linear_1641:2314)"
          strokeOpacity={0.3}
        />
        <path
          d="M1313 584l165 194"
          stroke="url(#paint8_linear_1641:2314)"
          strokeOpacity={0.3}
        />
        <path
          d="M1172 584l97 190"
          stroke="url(#paint9_linear_1641:2314)"
          strokeOpacity={0.3}
        />
        <path
          d="M1069 584l44 190"
          stroke="url(#paint10_linear_1641:2314)"
          strokeOpacity={0.3}
        />
        <defs>
          <linearGradient
            id="paint0_linear_1641:2314"
            x1={960}
            y1={773.258}
            x2={960}
            y2={774.258}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DD2FBE" />
            <stop offset={1} stopColor="#0098EE" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1641:2314"
            x1={960}
            y1={583.361}
            x2={960}
            y2={584.361}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DD2FBE" />
            <stop offset={1} stopColor="#0098EE" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_1641:2314"
            x1={327}
            y1={583}
            x2={327}
            y2={773}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DD2FBE" />
            <stop offset={1} stopColor="#0098EE" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_1641:2314"
            x1={547.5}
            y1={584}
            x2={547.5}
            y2={773}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DD2FBE" />
            <stop offset={1} stopColor="#0098EE" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_1641:2314"
            x1={714.5}
            y1={584}
            x2={714.5}
            y2={774}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DD2FBE" />
            <stop offset={1} stopColor="#0098EE" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_1641:2314"
            x1={856}
            y1={584}
            x2={856}
            y2={774}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DD2FBE" />
            <stop offset={1} stopColor="#0098EE" />
          </linearGradient>
          <linearGradient
            id="paint6_linear_1641:2314"
            x1={1599}
            y1={583}
            x2={1599}
            y2={773}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DD2FBE" />
            <stop offset={1} stopColor="#0098EE" />
          </linearGradient>
          <linearGradient
            id="paint7_linear_1641:2314"
            x1={973.5}
            y1={586}
            x2={973.5}
            y2={774}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DD2FBE" />
            <stop offset={1} stopColor="#0098EE" />
          </linearGradient>
          <linearGradient
            id="paint8_linear_1641:2314"
            x1={1395.5}
            y1={584}
            x2={1395.5}
            y2={778}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DD2FBE" />
            <stop offset={1} stopColor="#0098EE" />
          </linearGradient>
          <linearGradient
            id="paint9_linear_1641:2314"
            x1={1220.5}
            y1={584}
            x2={1220.5}
            y2={774}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DD2FBE" />
            <stop offset={1} stopColor="#0098EE" />
          </linearGradient>
          <linearGradient
            id="paint10_linear_1641:2314"
            x1={1091}
            y1={584}
            x2={1091}
            y2={774}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DD2FBE" />
            <stop offset={1} stopColor="#0098EE" />
          </linearGradient>
        </defs>
      </Icon>
    </Flex>
  );
};
