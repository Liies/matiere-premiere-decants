import { useEffect, useState, type RefObject } from "react";

const DEFAULT_ROOT_MARGIN = "180px 0px";

/** Active un contenu coûteux seulement lorsque son conteneur approche du viewport. */
export function useDeferredElementVisibility<T extends Element>(
  targetRef: RefObject<T | null>,
  enabled: boolean,
  rootMargin = DEFAULT_ROOT_MARGIN,
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!enabled || !target) {
      setIsVisible(false);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    setIsVisible(false);
    const observer = new window.IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsVisible(true);
      observer.disconnect();
    }, { rootMargin });
    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, rootMargin, targetRef]);

  return isVisible;
}
