import { create } from 'zustand';

export const useFloatingBarStore = create((set) => ({
  isVisible: false,
  open: () => set({ isVisible: true }),
  close: () => set({ isVisible: false }),
  toggle: () => set((state) => ({ isVisible: !state.isVisible })),
}));
