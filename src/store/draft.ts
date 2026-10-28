import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useDraft = create(
  persist<{
    draft: Record<string, unknown> | null;
    setDraft: (d: Record<string, unknown> | null) => void;
  }>(
    (set) => ({
      draft: null,
      setDraft: (d) => set({ draft: d }),
    }),
    { name: "lectura-draft", storage: createJSONStorage(() => AsyncStorage) }
  )
);
