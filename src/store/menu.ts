import { reactive } from 'vue';

export const useMenuStore = () => {
  const state = reactive({
    isMenuOpen: false,
    color: 'Light' as 'Dark' | 'Light'
  });

  const toggleMenu = (payload: { isMenuOpen: boolean; color?: 'Dark' | 'Light' }) => {
    state.isMenuOpen = payload.isMenuOpen;
    if (payload.color) {
      state.color = payload.color;
    }
  };

  return {
    state,
    toggleMenu
  };
};

export const menuStore = useMenuStore();
