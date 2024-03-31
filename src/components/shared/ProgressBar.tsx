import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Modified code from https://github.com/MatinAniss/traction.js

interface ProgressBarProps {
  color: string;
  incrementInterval: number;
  incrementAmount: number;
  transitionDuration: number;
  transitionTimingFunction:
    | "ease"
    | "linear"
    | "ease-in"
    | "ease-out"
    | "ease-in-out";
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  // Declare states
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Progress bar inline styling
  const styling = {
    position: "fixed",
    top: 0,
    left: 0,
    width: `${progress}%`,
    height: "2px",
    backgroundColor: props.color,
    transition: `width ${props.transitionDuration}ms ${props.transitionTimingFunction}`,
    opacity: isVisible ? 1 : 0,
    zIndex: 9999999999,
  } as React.CSSProperties;
  useEffect(() => {
    // Declare timeout
    let status: "in-progress" | "idle" = "idle";
    let intervalId: NodeJS.Timeout;

    // Route change start function
    const onRouteChangeStart = async () => {
      status = "in-progress";

      // only show progress bar if it takes longer than 200ms for the page to load
      await wait(200);

      if (status !== "in-progress") {
        return;
      }

      setIsVisible(true);
      setProgress(props.incrementAmount);
      // clear any existing interval
      clearInterval(intervalId);

      const newIntervalId = setInterval(() => {
        if (status === "idle") {
          clearInterval(newIntervalId);
          return;
        }
        setProgress((_progress) => {
          return Math.min(_progress + props.incrementAmount, 90);
        });
      }, props.incrementInterval);

      intervalId = newIntervalId;
    };

    // Route change complete function
    const onRouteChangeComplete = () => {
      status = "idle";
      clearInterval(intervalId);
      setProgress(100);
      setTimeout(() => {
        if (status === "idle") {
          setIsVisible(false);
          setProgress(0);
        }
      }, props.transitionDuration);
    };

    // Route change error function
    const onRouteChangeError = () => {
      status = "idle";
      clearInterval(intervalId);
      setIsVisible(false);
      setProgress(0);
    };

    // Router event listeners
    router.events.on("routeChangeStart", onRouteChangeStart);
    router.events.on("routeChangeComplete", onRouteChangeComplete);
    router.events.on("routeChangeError", onRouteChangeError);

    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart);
      router.events.off("routeChangeComplete", onRouteChangeComplete);
      router.events.off("routeChangeError", onRouteChangeError);
      clearInterval(intervalId);
    };
  }, [
    props.incrementAmount,
    props.incrementInterval,
    props.transitionDuration,
    router.events,
  ]);

  // eslint-disable-next-line react/forbid-dom-props
  return <div style={styling}></div>;
};
