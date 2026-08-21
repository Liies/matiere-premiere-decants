const MAX_SCROLL_DISTANCE = 520;

export function getProductVisualMotion(scrollY: number) {
  const clampedScroll = Math.min(Math.max(scrollY, 0), MAX_SCROLL_DISTANCE);
  const progress = clampedScroll / MAX_SCROLL_DISTANCE;

  return {
    scale: Number((1 + progress * 0.035).toFixed(4)),
    translateY: Number((-progress * 14).toFixed(2)),
    rotate: Number((progress * 0.35).toFixed(3)),
  };
}
