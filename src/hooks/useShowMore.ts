import { useCallback, useMemo, useRef, useState } from "react";

export function useShowMore<T extends HTMLElement>(
  initialItemsToShow: number,
  itemsToAdd: number,
) {
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);
  const prevNode = useRef<T | null>(null);

  const observer = useMemo(() => {
    // server
    if (typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    return new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setItemsToShow((prev) => prev + itemsToAdd);
        }
      },
      { threshold: 1 },
    );
  }, [itemsToAdd]);

  const lastItemRef = useCallback(
    (node: T) => {
      if (!node) {
        return;
      }

      if (prevNode.current) {
        observer?.unobserve(prevNode.current);
      }

      observer?.observe(node);
      prevNode.current = node;
    },
    [observer],
  );

  return { itemsToShow, lastItemRef };
}
