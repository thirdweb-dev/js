"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import "./scaler-app.css";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ScalarApiReference() {
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
        url: "https://api.thirdweb.com/openapi.json",
        theme: "deepSpace",
        layout: "modern",
        showSidebar: true,
        hideModels: false,
        hideDarkModeToggle: true, // Hide since portal controls theme
        hideDownloadButton: false,
        hideTestRequestButton: false,
      }}
    />
  );
}
