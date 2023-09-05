export function autoHeightTransition(
  element: HTMLElement,
  heightTransition: string,
) {
  const recalculate = () => {
    // remove height and transition
    element.style.transition = "";
    element.style.height = "";

    requestAnimationFrame(() => {
      // measure new height
      const newHeight = element.scrollHeight;

      // apply prev height immediately
      element.style.height = element.dataset.height as string;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // add transition back
          element.style.transition = heightTransition;

          requestAnimationFrame(() => {
            // apply newHeight
            element.style.height = newHeight + "px";
            element.dataset.height = newHeight + "px";
          });
        });
      });
    });
  };

  const observer = new MutationObserver(() => {
    recalculate();
  });

  // save current height
  element.dataset.height = element.scrollHeight + "px";

  // set required styles
  element.style.overflow = "hidden";
  element.style.boxSizing = "border-box";

  observer.observe(element, {
    subtree: true,
    childList: true,
    characterData: true,
  });

  return () => {
    observer.disconnect();
  };
}
