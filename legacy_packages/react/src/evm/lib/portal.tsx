import {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
  useRef,
  PropsWithChildren,
} from "react";
import { createPortal } from "react-dom";

function canUseDOM() {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
}

/**
 * Forces a re-render, similar to `forceUpdate` in class components.
 */
function useForceUpdate() {
  const [, dispatch] = useState(Object.create(null));
  return useCallback(() => {
    dispatch(Object.create(null));
  }, []);
}

const useIsomorphicLayoutEffect = /* @__PURE__ */ canUseDOM()
  ? useLayoutEffect
  : useEffect;

/**
 * Portal from `@reach/portal`
 *
 * @see Docs https://reach.tech/portal#portal
 */
const PortalImpl: React.FC<PortalProps> = ({
  children,
  type = "reach-portal",
  containerRef,
}) => {
  const mountNode = useRef<HTMLDivElement | null>(null);
  const portalNode = useRef<HTMLElement | null>(null);
  const forceUpdate = useForceUpdate();

  useIsomorphicLayoutEffect(() => {
    // This ref may be null when a hot-loader replaces components on the page
    if (!mountNode.current) {
      return;
    }
    // It's possible that the content of the portal has, itself, been portaled.
    // In that case, it's important to append to the correct document element.
    const ownerDocument = mountNode.current.ownerDocument;
    const body = containerRef?.current || ownerDocument.body;
    portalNode.current = ownerDocument?.createElement(type);
    body.appendChild(portalNode.current);
    forceUpdate();
    return () => {
      if (portalNode.current && body) {
        body.removeChild(portalNode.current);
      }
    };
  }, [type, forceUpdate, containerRef]);

  return portalNode.current ? (
    createPortal(children, portalNode.current)
  ) : (
    <span ref={mountNode} />
  );
};

export const Portal: React.FC<PortalProps> = ({
  unstable_skipInitialRender,
  ...props
}) => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (unstable_skipInitialRender) {
      setHydrated(true);
    }
  }, [unstable_skipInitialRender]);
  if (unstable_skipInitialRender && !hydrated) {
    return null;
  }
  return <PortalImpl {...props} />;
};

export type PortalProps = PropsWithChildren<{
  type?: string;
  containerRef?: React.RefObject<Node>;
  unstable_skipInitialRender?: boolean;
}>;
