import { openDb, initDb } from "../db/schema";

function mesActual(): string {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  return `${ahora.getFullYear()}-${mes}`;
}

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
  const mes = mesActual();
  try {
    await db.runAsync(
      `INSERT INTO lecturas (uuid, codigo_medidor, mes, lectura, estado_medidor, motivo, descripcion_dano, foto_ruta, estado_envio, creado_en)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', ?)`,
      [newUuid(), data.codigo, mes, data.lectura ?? null, data.estado, data.motivo ?? null, data.descripcionDano ?? null, data.fotoRuta ?? null, new Date().toISOString()]
    );
    return { ok: true };
  } catch (e: any) {
    const message = String(e?.message ?? e);
    if (message.includes("UNIQUE")) {
      return { ok: false, message: `Ya existe una lectura local para ${data.codigo} en ${mes}.` };
    }
    return { ok: false, message };
  }
}

export async function actualizarLectura(
  uuid: string,
  data: { estado: "normal" | "inaccesible" | "danado"; lectura?: number; motivo?: string; descripcionDano?: string; fotoRuta?: string }
): Promise<{ ok: boolean; message?: string }> {
  const db = await openDb();
  await initDb(db);
  try {
    await db.runAsync(
      `UPDATE lecturas SET estado_medidor = ?, lectura = ?, motivo = ?, descripcion_dano = ?, foto_ruta = ? WHERE uuid = ? AND estado_envio = 'pendiente'`,
      [data.estado, data.lectura ?? null, data.motivo ?? null, data.descripcionDano ?? null, data.fotoRuta ?? null, uuid]
    );
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: String(e?.message ?? e) };
  }
}
