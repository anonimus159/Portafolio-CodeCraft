import { create } from 'zustand';

interface AppState {
  isCommandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  toggleCommand: () => void;
}

export const useStore = create<AppState>((set) => ({
  isCommandOpen: false,
  setCommandOpen: (open) => set({ isCommandOpen: open }),
  toggleCommand: () => set((state) => ({ isCommandOpen: !state.isCommandOpen })),
}));
