import { DarkMode, Flex } from "@chakra-ui/react";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageFooter } from "components/product-pages/homepage/Footer";
import { NextSeo, NextSeoProps } from "next-seo";
import React, { PropsWithChildren } from "react";

interface IProductPage {
  seo: NextSeoProps;
}

export const ProductPage: React.FC<PropsWithChildren<IProductPage>> = ({
  seo,
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
        }}
        justify="center"
        flexDir="column"
        as="main"
        bg="#000"
      >
        <HomepageTopNav />

        {children}

        <HomepageFooter />
      </Flex>
    </DarkMode>
  );
};
