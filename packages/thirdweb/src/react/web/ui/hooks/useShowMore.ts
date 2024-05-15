import { useCallback, useState } from "react";

/**
 *
 * @internal
 */
export function useShowMore<T extends HTMLElement>(
  initialItemsToShow: number,
  itemsToAdd: number,
) {
  // start with showing first `initialItemsToShow` items, when the last item is in view, show `itemsToAdd` more
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);
  const lastItemRef = useCallback(
    (node: T) => {
      if (!node) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setItemsToShow((prev) => prev + itemsToAdd); // show 10 more items
          }
        },
        { threshold: 1 },
      );

      observer.observe(node);
      // when the node is removed from the DOM, observer will be disconnected automatically by the browser
    },
    [itemsToAdd],
  );

  return { itemsToShow, lastItemRef };
}
