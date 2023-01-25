import { BuildSection } from "./key-features/BuildSection";
import { HowItWorksSection } from "./key-features/HowItWorksSection";
import { LaunchSection } from "./key-features/LaunchSection";
import { ManageSection } from "./key-features/ManageSection";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import React from "react";

export const KeyFeaturesSection = () => {
  return (
    <HomepageSection my={60}>
      <HowItWorksSection />
      <BuildSection />
      <LaunchSection />
      <ManageSection />
    </HomepageSection>
  );
};
