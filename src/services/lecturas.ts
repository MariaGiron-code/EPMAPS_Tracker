import { openDb, initDb } from "../db/schema";

export function newUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function guardarLecturaPendiente(data: {
  codigo: string;
  estado: "normal" | "inaccesible" | "danado";
  lectura?: number;
  motivo?: string;
  descripcionDano?: string;
  fotoRuta?: string;
}): Promise<{ ok: boolean; message?: string }> {
  const db = await openDb();
  await initDb(db);
  const mes = new Date().toISOString().slice(0, 7);
  try {
    await db.runAsync(
      `INSERT INTO lecturas (uuid, codigo_medidor, mes, lectura, estado_medidor, motivo, descripcion_dano, foto_ruta, estado_envio, creado_en)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', ?)`,
      [newUuid(), data.codigo, mes, data.lectura ?? null, data.estado, data.motivo ?? null, data.descripcionDano ?? null, data.fotoRuta ?? null, new Date().toISOString()]
    );
    return { ok: true };
  } catch (e: any) {
    if (String(e?.message ?? e).includes("UNIQUE")) {
      return { ok: false, message: "Ya existe una lectura de este medidor en este mes." };
    }
    return { ok: false, message: String(e?.message ?? e) };
  }
}