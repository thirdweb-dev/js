import { Box, DarkMode, Flex } from "@chakra-ui/react";
import { HomepageFooter } from "components/footer/Footer";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { NextSeo, NextSeoProps } from "next-seo";
import React, { PropsWithChildren } from "react";

interface IProductPage {
  seo: NextSeoProps;
  accentColor?: string;
}

export const ProductPage: React.FC<PropsWithChildren<IProductPage>> = ({
  seo,
  accentColor,
  children,
}) => {
  return (
    <DarkMode>
      <NextSeo {...seo} />
      <Flex
        sx={{
          // overwrite the theme colors because the home page is *always* in "dark mode"
          "--chakra-colors-heading": "#F2F2F7",
          "--chakra-colors-paragraph": "#AEAEB2",
          "--chakra-colors-borderColor": "rgba(255,255,255,0.1)",
          "--product-accent-color": accentColor || "rgba(24, 67, 78, 0.8)",
        }}
        justify="center"
        flexDir="column"
        as="main"
        bg="#000"
      >
        <HomepageTopNav />
        {/* pull it up by as much as the topnav is tall */}
        <Box mt="-80px" overflowX="hidden">
          {children}
        </Box>
        <HomepageFooter />
      </Flex>
    </DarkMode>
  );
};
