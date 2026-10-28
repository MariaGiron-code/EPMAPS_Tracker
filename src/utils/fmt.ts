/** Retorna la fecha formateada o "sin fecha" si el valor es nulo/vacío. */
export function fmtFecha(f?: string | null): string {
  return f?.trim() ? f : "sin fecha";
}
