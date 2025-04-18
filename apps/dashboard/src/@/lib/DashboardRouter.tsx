"use client";

// eslint-disable-next-line no-restricted-imports
import { useRouter } from "next/navigation";
import {
  type TransitionStartFunction,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { createStore } from "./reactive";

// Using useDashboardRouter instead of useRouter gives us a nice progress bar on top of the page when navigating using router.push or router.replace

const RouteStartTransitionFn = createStore<TransitionStartFunction>((fn) =>
  fn(),
);

export function useDashboardRouter() {
  const startTransition = useSyncExternalStore(
    RouteStartTransitionFn.subscribe,
    RouteStartTransitionFn.getValue,
    RouteStartTransitionFn.getValue,
  );

  const router = useRouter();
  return useMemo(() => {
    return {
      ...router,
      replace(href: string, options?: { scroll?: boolean }) {
        startTransition(() => {
          router.replace(href, options);
        });
      },
      push(href: string, options?: { scroll?: boolean }) {
        startTransition(() => {
          router.push(href, options);
        });
      },
    };
  }, [router, startTransition]);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function DashboardRouterTopProgressBar() {
  const [isRouteLoading, startTransition] = useTransition();
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    RouteStartTransitionFn.setValue(startTransition);
  }, []);

  const [progress, setProgress] = useState(0);
  const progressStartedRef = useRef(false);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!isRouteLoading) {
      setProgress(0);
      progressStartedRef.current = false;
      return;
    }

    if (progressStartedRef.current) {
      return;
    }

    let isMounted = true;

    progressStartedRef.current = true;

    async function updateProgressBar(progress: number, delay: number) {
      if (!isMounted) {
        if (!isRouteLoading) {
          setProgress(100);
        }
        return;
      }

      setProgress(progress);
      await wait(delay);

      // increase progress by 10% of the remaining progress
      // increase the delay by 5% to slow down number of updates for slower progress
      updateProgressBar(progress + (100 - progress) / 10, delay * 1.05);
    }

    async function startEffect() {
      // if the loading state remains for at least 500ms start the progress bar
      await wait(500);
      if (isMounted) {
        updateProgressBar(0, 100);
      }
    }

    startEffect();

    return () => {
      isMounted = false;
    };
  }, [isRouteLoading]);

  const width = isRouteLoading ? progress : 100;
  return (
    <span
      className="fixed top-0 block h-[3px] bg-foreground"
      style={{
        opacity: isRouteLoading ? "100" : "0",
        width: `${width}%`,
        transition: width === 0 ? "none" : "width 0.2s ease, opacity 0.3s ease",
        zIndex: "100000000",
        pointerEvents: "none",
      }}
    />
  );
}
