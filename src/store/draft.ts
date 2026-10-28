import { create, type StoreApi, type UseBoundStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DraftState = {
  draft: Record<string, unknown> | null;
  setDraft: (d: Record<string, unknown> | null) => void;
};

// Mapa de stores por código de medidor para aislar borradores
const _storeMap = new Map<string, UseBoundStore<StoreApi<DraftState>>>();

/**
 * Retorna (o crea) un store de borrador específico para el código de medidor dado.
 * Cada código usa su propia clave en AsyncStorage ("lectura-draft-<codigo>").
 */
export function useDraftForCodigo(codigo: string) {
  if (!_storeMap.has(codigo)) {
    _storeMap.set(
      codigo,
      create<DraftState>()(
        persist(
          (set) => ({
            draft: null,
            setDraft: (d) => set({ draft: d }),
          }),
          {
            name: `lectura-draft-${codigo}`,
            storage: createJSONStorage(() => AsyncStorage),
          }
        )
      )
    );
  }
  return _storeMap.get(codigo)!;
}
