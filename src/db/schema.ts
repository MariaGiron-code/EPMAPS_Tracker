import * as SQLite from "expo-sqlite";

export const DB_NAME = "epmaps.db";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function openDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

export async function initDb(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS medidores (
      codigo TEXT PRIMARY KEY,
      direccion TEXT NOT NULL,
      sector TEXT NOT NULL,
      cuenta TEXT NOT NULL,
      estado TEXT NOT NULL,
      ultima_lectura REAL,
      fecha_ultima TEXT,
      consumo_promedio REAL
    );

    CREATE TABLE IF NOT EXISTS lecturas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT NOT NULL UNIQUE,
      codigo_medidor TEXT NOT NULL,
      mes TEXT NOT NULL,
      lectura REAL,
      estado_medidor TEXT NOT NULL,
      motivo TEXT,
      descripcion_dano TEXT,
      foto_ruta TEXT,
      estado_envio TEXT NOT NULL CHECK (estado_envio IN ('pendiente','enviando','enviada')),
      creado_en TEXT NOT NULL,
      UNIQUE(codigo_medidor, mes),
      FOREIGN KEY (codigo_medidor) REFERENCES medidores(codigo)
    );
  `);
}
