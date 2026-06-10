import type { ObjectDirective } from 'vue';
import { registerScrollChaining } from '../lib/scrollHelper';

interface ScrollChainEl extends HTMLElement {
  _cleanupScroll?: () => void;
}

export const vScrollChain: ObjectDirective<ScrollChainEl> = {
  mounted(el) {
    el._cleanupScroll = registerScrollChaining(el);
  },
  unmounted(el) {
    if (el._cleanupScroll) {
      el._cleanupScroll();
      delete el._cleanupScroll;
    }
  }
};
