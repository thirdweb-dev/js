"use client";
import { useState } from "react";

export default function ShareTwitterButton({ targetId }) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareStatus, setShareStatus] = useState(null);

  const handleShare = async () => {
    setIsSharing(true);
    setShareStatus(null);
    // Get the target element to share
    const divElement = document.getElementById(targetId);
    if (!divElement) {
      setShareStatus({ type: "error", message: "Element not found" });
      setIsSharing(false);
      return;
    }
    try {
      // Dynamically import html2canvas
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default;
      const canvas = await html2canvas(divElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      // Copy to clipboard
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });
      const data = [new ClipboardItem({ "image/png": blob })];
      await navigator.clipboard.write(data);
      // Also save image for manual sharing
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "share-image.png";
      link.click();
      // Prepare Twitter share URL with better text prompt
      const tweetText = encodeURIComponent(
        "Check this out! (Image copied to clipboard) #YourHashtag",
      );
      const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
      // Open Twitter share dialog
      window.open(twitterUrl, "_blank", "width=550,height=420");
      setShareStatus({
        type: "success",
        message: "Image copied and ready to share!",
      });
    } catch (error) {
      console.error("Failed to share to Twitter: ", error);
      setShareStatus({
        type: "error",
        message: "Failed to share. Please try again.",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const XIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  return (
    <div className="inline-block">
      <button
        type="button"
        onClick={handleShare}
        disabled={isSharing}
        aria-busy={isSharing}
        className={`ml-2 flex items-center gap-2 rounded border border-gray-400 px-3 py-1 font-semibold text-sm shadow transition ${
          isSharing
            ? "cursor-wait bg-gray-200"
            : "bg-white text-gray-800 hover:bg-gray-100"
        }`}
      >
        <XIcon />
        {isSharing ? "Processing..." : "Share on X"}
      </button>
      {shareStatus && (
        <div
          className={`mt-2 text-sm ${shareStatus.type === "error" ? "text-red-600" : "text-green-600"}`}
          role="status"
          aria-live="polite"
        >
          {shareStatus.message}
        </div>
      )}
    </div>
  );
}
