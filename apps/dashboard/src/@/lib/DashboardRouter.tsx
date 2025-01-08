"use client";

// eslint-disable-next-line no-restricted-imports
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createStore } from "./reactive";

// Using useDashboardRouter instead of useRouter gives us a nice progress bar on top of the page when navigating using router.push or router.replace

// using a store instead of context to avoid triggering re-renders on root component
const LoadingRouteHref = createStore<string | undefined>(undefined);

export function useDashboardRouter() {
  const router = useRouter();
  return useMemo(() => {
    return {
      ...router,
      replace(href: string, options?: { scroll?: boolean }) {
        LoadingRouteHref.setValue(href);
        router.replace(href, options);
      },
      push(href: string, options?: { scroll?: boolean }) {
        LoadingRouteHref.setValue(href);
        router.push(href, options);
      },
    };
  }, [router]);
}

function useRouterLoadingStatus() {
  const loadingHref = useSyncExternalStore(
    LoadingRouteHref.subscribe,
    LoadingRouteHref.getValue,
    LoadingRouteHref.getValue,
  );
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsStr = searchParams?.toString();

  const routerHref = pathname + (searchParamsStr ? `?${searchParamsStr}` : "");
  const isLoading = loadingHref && loadingHref !== routerHref;

  // reset loading on route load
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!isLoading) {
      LoadingRouteHref.setValue(undefined);
    }
  }, [isLoading]);

  return isLoading;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Render this on root
function DashboardRouterTopProgressBarInner() {
  const isLoading = useRouterLoadingStatus();
  const [progress, setProgress] = useState(0);

  const progressStartedRef = useRef(false);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!isLoading) {
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
        if (!isLoading) {
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
  }, [isLoading]);

  const width = isLoading ? progress : 100;
  return (
    <span
      className="fixed top-0 block h-[2px] bg-blue-500"
      style={{
        opacity: isLoading ? "100" : "0",
        width: `${width}%`,
        transition: width === 0 ? "none" : "width 0.2s ease, opacity 0.3s ease",
        zIndex: "100000000",
        pointerEvents: "none",
      }}
    />
  );
}

// need to wrap with suspense because of useSearchParams usage
export function DashboardRouterTopProgressBar() {
  return (
    <Suspense fallback={null}>
      <DashboardRouterTopProgressBarInner />
    </Suspense>
  );
}
