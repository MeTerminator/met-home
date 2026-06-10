
/**
 * Finds the first scrollable ancestor or descendant of an element.
 */
function findScrollableElement(el: HTMLElement): HTMLElement {
  const isScrollable = (node: HTMLElement) => {
    if (node.scrollHeight <= node.clientHeight) return false;
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    return overflowY === 'auto' || overflowY === 'scroll' || node.classList.contains('am-lyric') || node.classList.contains('amll-lyric-player');
  };

  if (isScrollable(el)) return el;

  const descendants = el.querySelectorAll('*');
  for (let i = 0; i < descendants.length; i++) {
    const child = descendants[i] as HTMLElement;
    if (isScrollable(child)) {
      return child;
    }
  }

  return el;
}

/**
 * Registers scroll chaining on an element.
 * When scrolling reaches the boundary (top or bottom), further scrolls propagate to fullpage.js.
 */
export function registerScrollChaining(el: HTMLElement) {
  if (typeof window === 'undefined') return () => {};

  let touchStartY = 0;
  let touchStartX = 0;
  let hasTriggeredTransition = false;
  let wasAtTop = false;
  let wasAtBottom = false;

  const handleWheel = (e: WheelEvent) => {
    const target = findScrollableElement(el);
    const { scrollTop, scrollHeight, clientHeight } = target;
    const isScrollable = scrollHeight > clientHeight;

    if (!isScrollable) {
      // Let the wheel event bubble so fullpage.js handles it
      return;
    }

    const isAtTop = scrollTop <= 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

    // e.deltaY > 0 is scrolling down (page goes up)
    // e.deltaY < 0 is scrolling up (page goes down)
    if (e.deltaY < 0 && isAtTop) {
      if ((window as any).fullpage_api) {
        (window as any).fullpage_api.moveSectionUp();
      }
    } else if (e.deltaY > 0 && isAtBottom) {
      if ((window as any).fullpage_api) {
        (window as any).fullpage_api.moveSectionDown();
      }
    } else {
      // Scroll internally, stop propagation so fullpage.js doesn't transition
      e.stopPropagation();
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      hasTriggeredTransition = false;

      const target = findScrollableElement(el);
      const { scrollTop, scrollHeight, clientHeight } = target;
      wasAtTop = scrollTop <= 0;
      wasAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 1 || hasTriggeredTransition) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = touchStartY - currentY; // positive = swipe up (scroll down), negative = swipe down (scroll up)
    const deltaX = touchStartX - currentX;

    // Only process vertical swipes
    if (Math.abs(deltaY) < Math.abs(deltaX)) return;

    const threshold = 40; // minimum swipe distance to trigger section switch
    const target = findScrollableElement(el);
    const { scrollHeight, clientHeight } = target;
    const isScrollable = scrollHeight > clientHeight;

    if (!isScrollable) {
      // If content is not scrollable, swipe gesture transitions section directly
      if (deltaY > threshold) {
        hasTriggeredTransition = true;
        if ((window as any).fullpage_api) {
          (window as any).fullpage_api.moveSectionDown();
        }
      } else if (deltaY < -threshold) {
        hasTriggeredTransition = true;
        if ((window as any).fullpage_api) {
          (window as any).fullpage_api.moveSectionUp();
        }
      }
      return;
    }

    if (deltaY > threshold && wasAtBottom) {
      hasTriggeredTransition = true;
      if ((window as any).fullpage_api) {
        (window as any).fullpage_api.moveSectionDown();
      }
    } else if (deltaY < -threshold && wasAtTop) {
      hasTriggeredTransition = true;
      if ((window as any).fullpage_api) {
        (window as any).fullpage_api.moveSectionUp();
      }
    } else {
      // Scroll internally, stop propagation so fullpage.js doesn't transition
      e.stopPropagation();
    }
  };

  el.addEventListener('wheel', handleWheel, { passive: false });
  el.addEventListener('touchstart', handleTouchStart, { passive: true });
  el.addEventListener('touchmove', handleTouchMove, { passive: false });

  return () => {
    el.removeEventListener('wheel', handleWheel);
    el.removeEventListener('touchstart', handleTouchStart);
    el.removeEventListener('touchmove', handleTouchMove);
  };
}
