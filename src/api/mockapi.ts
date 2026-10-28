import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 8,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 2,
    },
  },
});

export const MOCKAPI_BASE = (process.env.EXPO_PUBLIC_MOCKAPI_URL ?? "https://example.mockapi.io/api/v1").replace(/\/$/, "");

export async function fetchMedidor(codigo: string) {
  const res = await fetch(`${MOCKAPI_BASE}/medidores?codigo=${encodeURIComponent(codigo)}`);
  if (!res.ok) throw new Error("Medidor no encontrado");
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Medidor no encontrado");
  }
  const medidor = data[0];
  return {
    ...medidor,
    fecha_ultima: medidor.fecha_ultima ?? medidor.fecha_ultima_lectura ?? null,
  };
}
