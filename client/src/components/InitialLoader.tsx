import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";
import { INITIAL_LOADER_EXIT_MS, INITIAL_LOADER_VISIBLE_MS } from "@shared/initial-loader";

type InitialLoaderProps = {
  onComplete: () => void;
};

export default function InitialLoader({ onComplete }: InitialLoaderProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const showTimer = window.setTimeout(
      () => setIsLeaving(true),
      reduceMotion ? 0 : INITIAL_LOADER_VISIBLE_MS,
    );

    return () => window.clearTimeout(showTimer);
  }, [reduceMotion]);

  useEffect(() => {
    if (!isLeaving) return;

    const exitTimer = window.setTimeout(onComplete, reduceMotion ? 0 : INITIAL_LOADER_EXIT_MS);
    return () => window.clearTimeout(exitTimer);
  }, [isLeaving, onComplete, reduceMotion]);

  return (
    <div
      className={`initial-loader ${isLeaving ? "initial-loader-leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Chargement de Matière Première"
    >
      <div className="initial-loader-mark" aria-hidden="true">
        <Leaf className="h-9 w-9 stroke-[1.25]" />
        <span className="initial-loader-wordmark">Matière Première</span>
      </div>
      <span className="sr-only">Chargement de la page d’accueil</span>
    </div>
  );
}
