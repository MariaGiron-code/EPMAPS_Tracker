import { create } from "zustand";

export const useStatus = create<{
  online: boolean;
  pending: number;
  setOnline: (v: boolean) => void;
  setPending: (n: number) => void;
}>((set) => ({
  online: false,
  pending: 0,
  setOnline: (v) => set({ online: v }),
  setPending: (n) => set({ pending: n }),
}));
