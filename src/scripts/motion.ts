// Progressive enhancement: all content is visible before this script runs.
// One-shot effects use the compositor and never change trading/demo state.
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
let observer: IntersectionObserver | undefined;
const animations = new Set<Animation>();

function configureMotion() {
  observer?.disconnect();
  animations.forEach((animation) => animation.cancel());
  animations.clear();
  if (preference.matches || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer?.unobserve(entry.target);
        const animation = entry.target.animate(
          [
            { opacity: 0.25, transform: 'translateY(22px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)' },
        );
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation)).catch(() => {});
      });
    },
    { threshold: 0.12 },
  );
  items.forEach((item) => observer?.observe(item));
}
configureMotion();
preference.addEventListener('change', configureMotion);
