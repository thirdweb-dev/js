"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import "./scalar.css";
import { useTheme } from "next-themes";
import type { OpenAPIV3 } from "openapi-types";
import { useEffect } from "react";

export function ScalarApiReference(props: { spec: OpenAPIV3.Document }) {
  const { theme } = useTheme();

  // scaler is using light-mode and dark-mode classes for theming
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }
  }, [theme]);

  return (
    <ApiReferenceReact
      configuration={{
        theme: "deepSpace",
        sources: [
          {
            content: props.spec,
          },
        ],
        layout: "modern",
        withDefaultFonts: false,
        showSidebar: true,
        hideModels: false,
        hideDarkModeToggle: true,
        hideDownloadButton: false,
        hideTestRequestButton: false,
      }}
    />
  );
}
