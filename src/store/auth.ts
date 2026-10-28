import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

const KEY = "epmaps_session";

export const useAuth = create<{
  user: string | null;
  loading: boolean;
  init: () => Promise<void>;
  login: (code: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
}>((set) => ({
  user: null,
  loading: true,
  init: async () => {
    const val = await SecureStore.getItemAsync(KEY);
    set({ user: val, loading: false });
  },
  login: async (code, pass) => {
    if (code === "TEC001" && pass === "1234") {
      await SecureStore.setItemAsync(KEY, code);
      set({ user: code });
      return true;
    }
    return false;
  },
  logout: async () => {
    await SecureStore.deleteItemAsync(KEY);
    set({ user: null });
  },
}));
