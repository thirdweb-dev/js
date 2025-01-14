import type React from "react";
import { LandingLayout } from "../../components/landing-pages/layout";
import { LandingPageThemeProvider } from "./ThemeProvider";

export default function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <LandingPageThemeProvider>
      <LandingLayout bgColor="#0F0F0F">{props.children}</LandingLayout>
    </LandingPageThemeProvider>
  );
}
