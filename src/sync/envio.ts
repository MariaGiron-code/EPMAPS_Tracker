import { openDb, initDb } from "../db/schema";
import { MOCKAPI_BASE } from "../api/mockapi";

export type LecturaRow = {
  id: number;
  uuid: string;
  codigo_medidor: string;
  mes: string;
  lectura: number | null;
  estado_medidor: string;
  motivo: string | null;
  descripcion_dano: string | null;
  foto_ruta: string | null;
  estado_envio: "pendiente" | "enviando" | "enviada";
  creado_en: string;
};

export async function listarPendientes(): Promise<LecturaRow[]> {
  const db = await openDb();
  await initDb(db);
  return db.getAllAsync<LecturaRow>(
    "SELECT * FROM lecturas WHERE estado_envio IN ('pendiente','enviando') ORDER BY creado_en"
  );
}

export async function contarPendientes(): Promise<number> {
  const db = await openDb();
  await initDb(db);
  const r = await db.getFirstAsync<{ n: number }>(
    "SELECT COUNT(*) as n FROM lecturas WHERE estado_envio IN ('pendiente','enviando')"
  );
  return r?.n ?? 0;
}

async function marcarEstado(uuid: string, estado: "pendiente" | "enviando" | "enviada"): Promise<void> {
  const db = await openDb();
  await initDb(db);
  await db.runAsync("UPDATE lecturas SET estado_envio = ? WHERE uuid = ?", [estado, uuid]);
}

export async function enviarUna(row: LecturaRow): Promise<boolean> {
  try {
    await marcarEstado(row.uuid, "enviando");

    // Comprobación previa por uuid (idempotencia, ADR-007)
    const check = await fetch(`${MOCKAPI_BASE}/lecturas?uuid=${encodeURIComponent(row.uuid)}`);
    let yaExiste = false;
    if (check.ok) {
      const body = await check.json();
      if (Array.isArray(body) && body.length > 0) yaExiste = true;
    }
    if (yaExiste) {
      await marcarEstado(row.uuid, "enviada");
      return true;
    }

    const res = await fetch(`${MOCKAPI_BASE}/lecturas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uuid: row.uuid,
        codigo_medidor: row.codigo_medidor,
        mes: row.mes,
        lectura: row.lectura,
        estado_medidor: row.estado_medidor,
        motivo: row.motivo,
        descripcion_dano: row.descripcion_dano,
        foto_ruta: row.foto_ruta,
        creado_en: row.creado_en,
      }),
    });
    if (!res.ok) throw new Error(`POST ${res.status}`);
    await marcarEstado(row.uuid, "enviada");
    return true;
  } catch {
    await marcarEstado(row.uuid, "pendiente");
    return false;
  }
}

export async function enviarPendientes(): Promise<number> {
  const db = await openDb();
  await initDb(db);
  // Recuperación tras cierre a mitad de envío (plan, paso 4)
  await db.runAsync("UPDATE lecturas SET estado_envio = 'pendiente' WHERE estado_envio = 'enviando'");

  const pendientes = await listarPendientes();
  let enviadas = 0;
  for (const row of pendientes) {
    const ok = await enviarUna(row);
    if (ok) {
      enviadas++;
    } else {
      break; // cortar ante el primer fallo (red)
    }
  }
  return enviadas;
}
