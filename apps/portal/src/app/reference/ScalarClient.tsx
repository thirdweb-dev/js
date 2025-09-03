"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import "@scalar/api-reference-react/style.css";

export default function ScalarApiReference() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <ApiReferenceReact
      configuration={{
        url: "https://api.thirdweb.com/openapi.json",
        theme: "default",
        customCss: `
					/* Match thirdweb portal theme - ${isDark ? "dark" : "light"} mode */
					.scalar-app {
						${
              isDark
                ? `
							/* Dark theme colors */
							--scalar-background-1: hsl(0 0% 0%);
							--scalar-background-2: hsl(0 0% 3.92%);
							--scalar-background-3: hsl(0 0% 11%);
							--scalar-background-accent: hsl(0 0% 11%);
							
							--scalar-color-1: hsl(0 0% 98%);
							--scalar-color-2: hsl(0 0% 63%);
							--scalar-color-3: hsl(0 0% 40%);
							--scalar-color-accent: hsl(221 83% 54%);
							
							--scalar-border-color: hsl(0 0% 15%);
							--scalar-border-color-active: hsl(0 0% 22%);
							
							/* Code blocks */
							--scalar-code-background: hsl(0 0% 3.92%);
							--scalar-code-color: hsl(0 0% 98%);
							
							/* Sidebar */
							--scalar-sidebar-background-1: hsl(0 0% 0%);
							--scalar-sidebar-background-2: hsl(0 0% 3.92%);
							--scalar-sidebar-color-1: hsl(0 0% 98%);
							--scalar-sidebar-color-2: hsl(0 0% 63%);
							--scalar-sidebar-color-active: hsl(221 83% 54%);
							--scalar-sidebar-border-color: hsl(0 0% 15%);
						`
                : `
							/* Light theme colors */
							--scalar-background-1: hsl(0 0% 98%);
							--scalar-background-2: hsl(0 0% 100%);
							--scalar-background-3: hsl(0 0% 93%);
							--scalar-background-accent: hsl(0 0% 93%);
							
							--scalar-color-1: hsl(0 0% 4%);
							--scalar-color-2: hsl(0 0% 40%);
							--scalar-color-3: hsl(0 0% 63%);
							--scalar-color-accent: hsl(221 83% 54%);
							
							--scalar-border-color: hsl(0 0% 85%);
							--scalar-border-color-active: hsl(0 0% 70%);
							
							/* Code blocks */
							--scalar-code-background: hsl(0 0% 93%);
							--scalar-code-color: hsl(0 0% 4%);
							
							/* Sidebar */
							--scalar-sidebar-background-1: hsl(0 0% 98%);
							--scalar-sidebar-background-2: hsl(0 0% 100%);
							--scalar-sidebar-color-1: hsl(0 0% 4%);
							--scalar-sidebar-color-2: hsl(0 0% 40%);
							--scalar-sidebar-color-active: hsl(221 83% 54%);
							--scalar-sidebar-border-color: hsl(0 0% 85%);
						`
            }
						
						/* Buttons and interactive elements */
						--scalar-button-1: hsl(221 83% 54%);
						--scalar-button-1-color: hsl(0 0% 100%);
						--scalar-button-1-hover: hsl(221 83% 60%);
						
						/* Success/error colors */
						--scalar-color-green: ${isDark ? "hsl(142 75% 50%)" : "hsl(142 70% 35%)"};
						--scalar-color-red: ${isDark ? "hsl(360 72% 55%)" : "hsl(360 72% 60%)"};
						--scalar-color-yellow: ${isDark ? "hsl(38 92% 50%)" : "hsl(38 92% 40%)"};
						--scalar-color-blue: ${isDark ? "hsl(215 100% 65%)" : "hsl(221 83% 54%)"};
						
						/* Font family to match portal */
						--scalar-font: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
						--scalar-font-code: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
					}
					
					/* Theme-specific overrides */
					.scalar-app.scalar-theme--default {
						color-scheme: ${isDark ? "dark" : "light"};
					}
					
					/* Hide theme toggle since portal controls theme */
					.scalar-app .scalar-button--ghost[title*="light"],
					.scalar-app .scalar-button--ghost[title*="dark"] {
						display: none;
					}
					
					/* Match border radius */
					.scalar-app * {
						--scalar-radius: 0.5rem;
					}
					
					/* Custom scrollbar to match portal */
					.scalar-app ::-webkit-scrollbar {
						width: 0.5rem;
						height: 0.5rem;
					}
					
					.scalar-app ::-webkit-scrollbar-thumb {
						border-radius: 0.5rem;
						background: ${isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 85%)"};
					}
					
					.scalar-app ::-webkit-scrollbar-thumb:hover {
						background: ${isDark ? "hsl(0 0% 22%)" : "hsl(0 0% 70%)"};
					}
					
					.scalar-app ::-webkit-scrollbar-track {
						background-color: transparent;
					}
					
					/* Ensure proper contrast for readability */
					.scalar-app .scalar-card {
						background: ${isDark ? "hsl(0 0% 3.92%)" : "hsl(0 0% 100%)"};
						border-color: ${isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 85%)"};
					}
					
					.scalar-app .scalar-sidebar-item--active {
						background: ${isDark ? "hsl(0 0% 11%)" : "hsl(0 0% 93%)"};
						color: hsl(221 83% 54%);
					}
					
					/* Make the API reference take full height */
					.scalar-app {
						min-height: 100vh;
					}
					
					/* Fix code syntax highlighting for both themes */
					.scalar-app pre,
					.scalar-app code,
					.scalar-app .scalar-code-block,
					.scalar-app .scalar-request-body-section code,
					.scalar-app .scalar-response-body code {
						background: ${isDark ? "hsl(0 0% 3.92%)" : "hsl(0 0% 93%)"} !important;
						color: ${isDark ? "hsl(0 0% 98%)" : "hsl(0 0% 4%)"} !important;
					}
					
					/* Syntax highlighting tokens for light/dark mode */
					.scalar-app .token.comment,
					.scalar-app .token.prolog,
					.scalar-app .token.doctype,
					.scalar-app .token.cdata {
						color: ${isDark ? "hsl(0 0% 63%)" : "hsl(0 0% 40%)"} !important;
					}
					
					.scalar-app .token.punctuation {
						color: ${isDark ? "hsl(0 0% 98%)" : "hsl(0 0% 4%)"} !important;
					}
					
					.scalar-app .token.property,
					.scalar-app .token.tag,
					.scalar-app .token.boolean,
					.scalar-app .token.number,
					.scalar-app .token.constant,
					.scalar-app .token.symbol,
					.scalar-app .token.deleted {
						color: ${isDark ? "hsl(215 100% 65%)" : "hsl(221 83% 54%)"} !important;
					}
					
					.scalar-app .token.selector,
					.scalar-app .token.attr-name,
					.scalar-app .token.string,
					.scalar-app .token.char,
					.scalar-app .token.builtin,
					.scalar-app .token.inserted {
						color: ${isDark ? "hsl(142 75% 50%)" : "hsl(142 70% 35%)"} !important;
					}
					
					.scalar-app .token.operator,
					.scalar-app .token.entity,
					.scalar-app .token.url,
					.scalar-app .language-css .token.string,
					.scalar-app .style .token.string {
						color: ${isDark ? "hsl(38 92% 50%)" : "hsl(38 92% 40%)"} !important;
					}
					
					.scalar-app .token.atrule,
					.scalar-app .token.attr-value,
					.scalar-app .token.keyword {
						color: ${isDark ? "hsl(321 90% 51%)" : "hsl(321 90% 41%)"} !important;
					}
					
					.scalar-app .token.function,
					.scalar-app .token.class-name {
						color: ${isDark ? "hsl(360 72% 55%)" : "hsl(360 72% 45%)"} !important;
					}
					
					.scalar-app .token.regex,
					.scalar-app .token.important,
					.scalar-app .token.variable {
						color: ${isDark ? "hsl(0 0% 98%)" : "hsl(0 0% 4%)"} !important;
					}
					
					/* JSON syntax highlighting */
					.scalar-app .token.property {
						color: ${isDark ? "hsl(215 100% 65%)" : "hsl(221 83% 54%)"} !important;
					}
					
					/* Override any existing syntax highlighting */
					.scalar-app pre[class*="language-"] {
						background: ${isDark ? "hsl(0 0% 3.92%)" : "hsl(0 0% 93%)"} !important;
						color: ${isDark ? "hsl(0 0% 98%)" : "hsl(0 0% 4%)"} !important;
					}
					
					.scalar-app code[class*="language-"] {
						background: ${isDark ? "hsl(0 0% 3.92%)" : "hsl(0 0% 93%)"} !important;
						color: ${isDark ? "hsl(0 0% 98%)" : "hsl(0 0% 4%)"} !important;
					}
					
					/* Inline code */
					.scalar-app code:not([class*="language-"]) {
						background: ${isDark ? "hsl(0 0% 11%)" : "hsl(0 0% 90%)"} !important;
						color: ${isDark ? "hsl(0 0% 98%)" : "hsl(0 0% 4%)"} !important;
						padding: 0.125rem 0.25rem !important;
						border-radius: 0.25rem !important;
					}
				`,
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
