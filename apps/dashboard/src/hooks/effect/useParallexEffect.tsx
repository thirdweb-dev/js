import { useEffect, useState } from "react";

export const useParallaxEffect = (speed = 0.5) => {
  const [offsetY, setOffsetY] = useState(0);

  // legit use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    function handleScroll() {
      setOffsetY(window.scrollY);
    }
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return offsetY * speed;
};
