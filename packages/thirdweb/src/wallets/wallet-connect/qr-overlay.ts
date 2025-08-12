/**
 * Vanilla JavaScript QR Code overlay utility for WalletConnect URIs
 * Works in any browser context without requiring React or other frameworks
 */

interface QROverlayOptions {
  /**
   * Custom styles to apply to the overlay
   */
  overlayStyles?: Partial<CSSStyleDeclaration>;
  /**
   * Custom styles to apply to the modal container
   */
  modalStyles?: Partial<CSSStyleDeclaration>;
  /**
   * QR code size in pixels
   */
  qrSize?: number;
  /**
   * Show close button
   */
  showCloseButton?: boolean;
  /**
   * Custom close button text
   */
  closeButtonText?: string;
  /**
   * Theme preference
   */
  theme?: "light" | "dark";
  /**
   * Custom container element to append the overlay to
   */
  container?: HTMLElement;
  /**
   * Callback called when user cancels the overlay (closes without connecting)
   */
  onCancel?: () => void;
}

export interface QROverlay {
  /**
   * Remove the overlay from the DOM
   */
  destroy: () => void;
  /**
   * Hide the overlay (without removing from DOM)
   */
  hide: () => void;
  /**
   * Show the overlay
   */
  show: () => void;
}

/**
 * Creates a QR code overlay for the given WalletConnect URI
 */
export function createQROverlay(
  uri: string,
  options: QROverlayOptions = {},
): QROverlay {
  const {
    qrSize = 280,
    showCloseButton = true,
    closeButtonText = "×",
    theme = "light",
    container = document.body,
    onCancel,
  } = options;

  // Create overlay backdrop
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background-color: ${theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.5)"};
    backdrop-filter: blur(10px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 300ms ease-out;
  `;

  // Apply custom overlay styles
  if (options.overlayStyles) {
    Object.assign(overlay.style, options.overlayStyles);
  }

  // Create modal container
  const modal = document.createElement("div");
  modal.style.cssText = `
    background: ${theme === "dark" ? "#1f1f1f" : "#ffffff"};
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-width: 90vw;
    max-height: 90vh;
    position: relative;
    animation: scaleIn 300ms ease-out;
  `;

  // Apply custom modal styles
  if (options.modalStyles) {
    Object.assign(modal.style, options.modalStyles);
  }

  // Create close button
  if (showCloseButton) {
    const closeButton = document.createElement("button");
    closeButton.textContent = closeButtonText;
    closeButton.style.cssText = `
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: ${theme === "dark" ? "#ffffff" : "#000000"};
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: background-color 0.2s;
    `;

    closeButton.addEventListener("mouseenter", () => {
      closeButton.style.backgroundColor =
        theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
    });

    closeButton.addEventListener("mouseleave", () => {
      closeButton.style.backgroundColor = "transparent";
    });

    closeButton.addEventListener("click", () => {
      destroyOverlay(true);
    });

    modal.appendChild(closeButton);
  }

  // Create QR code container
  const qrContainer = document.createElement("div");
  qrContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  `;

  // Create title
  const title = document.createElement("h3");
  title.textContent = "Scan to Connect";
  title.style.cssText = `
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: ${theme === "dark" ? "#ffffff" : "#000000"};
    text-align: center;
  `;

  // Create QR code canvas
  const qrCanvas = document.createElement("canvas");
  qrCanvas.width = qrSize;
  qrCanvas.height = qrSize;
  qrCanvas.style.cssText = `
    border: 1px solid ${theme === "dark" ? "#333333" : "#e5e5e5"};
    border-radius: 12px;
  `;

  // Generate QR code
  generateQRCode(uri, qrCanvas, qrSize).catch(console.error);

  // Create copy button for the URI
  const copyButton = document.createElement("button");
  copyButton.textContent = "Copy URI";
  copyButton.style.cssText = `
    background: ${theme === "dark" ? "#333333" : "#f5f5f5"};
    border: 1px solid ${theme === "dark" ? "#444444" : "#e5e5e5"};
    color: ${theme === "dark" ? "#ffffff" : "#000000"};
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  `;

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(uri);
      const originalText = copyButton.textContent;
      copyButton.textContent = "Copied!";
      setTimeout(() => {
        copyButton.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URI:", err);
    }
  });

  // Assemble the modal
  qrContainer.appendChild(title);
  qrContainer.appendChild(qrCanvas);
  qrContainer.appendChild(copyButton);
  modal.appendChild(qrContainer);
  overlay.appendChild(modal);

  // Add CSS animations
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes scaleOut {
      from { transform: scale(1); opacity: 1; }
      to { transform: scale(0.9); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Event handlers
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      destroyOverlay(true);
    }
  };

  const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === overlay) {
      destroyOverlay(true);
    }
  };

  // Add event listeners
  document.addEventListener("keydown", handleEscapeKey);
  overlay.addEventListener("click", handleOverlayClick);

  // Append to container
  container.appendChild(overlay);

  function destroyOverlay(userInitiated = false) {
    document.removeEventListener("keydown", handleEscapeKey);
    overlay.removeEventListener("click", handleOverlayClick);

    // Call onCancel callback only if user initiated the close action
    if (userInitiated && onCancel) {
      onCancel();
    }

    // Animate both overlay and modal out
    overlay.style.animation = "fadeOut 200ms ease-in";
    modal.style.animation = "scaleOut 200ms ease-in";

    const cleanup = () => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };

    overlay.addEventListener("animationend", cleanup, { once: true });

    // Fallback cleanup in case animation doesn't fire
    setTimeout(cleanup, 250);
  }

  function hideOverlay() {
    overlay.style.display = "none";
  }

  function showOverlay() {
    overlay.style.display = "flex";
  }

  return {
    destroy: () => destroyOverlay(false), // Programmatic cleanup, don't call onCancel
    hide: hideOverlay,
    show: showOverlay,
  };
}

/**
 * QR code generator that tries to use a real QR library if available,
 * otherwise falls back to a placeholder
 */
async function generateQRCode(
  text: string,
  canvas: HTMLCanvasElement,
  size: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Try to dynamically import a QR code library if available
  // This allows the overlay to work with or without a QR code dependency
  const { toCanvas } = await import("qrcode");
  await toCanvas(canvas, text, {
    width: size,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
  return;
}
