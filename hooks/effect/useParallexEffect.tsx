import { useEffect, useState } from "react";

export const useParallaxEffect = (speed = 0.5) => {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return offsetY * speed;
};
