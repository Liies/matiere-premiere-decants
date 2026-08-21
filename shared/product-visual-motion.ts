const MAX_SCROLL_DISTANCE = 520;

const clamp = (value: number, minimum: number, maximum: number) => Math.min(Math.max(value, minimum), maximum);

/** Accélère légèrement au départ puis se stabilise pour éviter une animation mécanique. */
const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

export function getProductVisualMotion(scrollY: number) {
  const progress = clamp(scrollY, 0, MAX_SCROLL_DISTANCE) / MAX_SCROLL_DISTANCE;
  const easedProgress = easeOutCubic(progress);

  return {
    scale: Number((1 + easedProgress * 0.045).toFixed(4)),
    translateX: Number((easedProgress * 3.5).toFixed(2)),
    translateY: Number((-easedProgress * 18).toFixed(2)),
    rotate: Number((easedProgress * 0.6).toFixed(3)),
  };
}
