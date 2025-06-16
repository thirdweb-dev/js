"use client";
import { Suspense } from "react";
import { ClientOnly } from "../../components/ClientOnly/ClientOnly";
import { useIsMobile } from "../hooks/use-mobile";

export function ResponsiveLayout(props: {
  desktop: React.ReactNode;
  mobile: React.ReactNode;
  fallback: React.ReactNode;
  debugMode?: boolean;
}) {
  const isMobile = useIsMobile();

  if (props.debugMode) {
    return props.fallback;
  }

  return (
    <Suspense fallback={props.fallback}>
      <ClientOnly ssr={props.fallback}>
        {isMobile ? props.mobile : props.desktop}
      </ClientOnly>
    </Suspense>
  );
}
