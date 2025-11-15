"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export function CopyPageButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Get the main content element
      const mainElement = document.querySelector("main");
      if (!mainElement) {
        return;
      }

      // Get text content, preserving some structure
      const textContent = mainElement.innerText || mainElement.textContent || "";

      await navigator.clipboard.writeText(textContent);
      setCopied(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy page content:", error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-2"
    >
      {copied ? (
        <>
          <CheckIcon className="size-4" />
          Copied!
        </>
      ) : (
        <>
          <CopyIcon className="size-4" />
          Copy Page
        </>
      )}
    </Button>
  );
}
