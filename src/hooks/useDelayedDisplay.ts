import { useEffect, useState } from "react";

const useDelayedDisplay = (delay: number) => {
  const [displayContent, setDisplayContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayContent(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay]);

  return displayContent;
};

export default useDelayedDisplay;
