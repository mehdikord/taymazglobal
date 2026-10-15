import fs from "node:fs";
import path from "node:path";

import mysql from "mysql2/promise";

const MIGRATIONS_DIR = path.join(process.cwd(), "migrations");
const MIGRATIONS_TABLE = "migrations";

const DATABASE_URL =
  process.env.DATABASE_URL ?? "mysql://root:Mehdi123@localhost:3306/taymaz";

async function connect(): Promise<mysql.Connection> {
  return mysql.createConnection({ uri: DATABASE_URL, multipleStatements: true });
}

async function ensureMigrationsTable(conn: mysql.Connection) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS \`${MIGRATIONS_TABLE}\` (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      migration VARCHAR(255) NOT NULL,
      batch INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NULL DEFAULT NULL,
      updated_at TIMESTAMP NULL DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE INDEX migrations_migration_unique (migration)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci
  `);
}

function getMigrationFiles(): string[] {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();
}

type ParsedMigration = { up: string; down: string };

function parseMigrationFile(file: string): ParsedMigration {
  const content = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");

  const upMatch = content.match(/^-- UP\s*$/m);
  const downMatch = content.match(/^-- DOWN\s*$/m);
  if (!upMatch) throw new Error(`Migration "${file}": missing "-- UP" section.`);

  const upStart = upMatch.index ?? 0;
  const downStart = downMatch ? downMatch.index : content.length;
  const up = content.slice(upStart, downStart).replace(/^-- UP\s*$/m, "").trim();
  const down = downMatch
    ? content.slice(downMatch.index).replace(/^-- DOWN\s*$/m, "").trim()
    : "";

  return { up, down };
}

export async function runStatus() {
  const conn = await connect();
  try {
    await ensureMigrationsTable(conn);

    const [rows] = await conn.query<mysql.RowDataPacket[]>(
      `SELECT migration, batch FROM \`${MIGRATIONS_TABLE}\` ORDER BY id`,
    );
    const applied = new Set(rows.map((row) => row.migration));
    const files = getMigrationFiles();
    const pending = files.filter((file) => !applied.has(file));

    console.log("Applied migrations:");
    if (rows.length === 0) console.log("  (none)");
    for (const row of rows) console.log(`  [${row.batch}] ${row.migration}`);

    console.log(`\nPending (${pending.length}):`);
    if (pending.length === 0) console.log("  (none)");
    for (const file of pending) console.log(`  ${file}`);
  } finally {
    await conn.end();
  }
}

export async function runUp(step?: number) {
  const conn = await connect();
  try {
    await ensureMigrationsTable(conn);

    const [rows] = await conn.query<mysql.RowDataPacket[]>(
      `SELECT migration FROM \`${MIGRATIONS_TABLE}\``,
    );
    const applied = new Set(rows.map((row) => row.migration));
    const pending = getMigrationFiles().filter((file) => !applied.has(file));

    if (pending.length === 0) {
      console.log("Nothing to migrate.");
      return;
    }

    const [[batchRow]] = await conn.query<mysql.RowDataPacket[]>(
      `SELECT COALESCE(MAX(batch), 0) AS max_batch FROM \`${MIGRATIONS_TABLE}\``,
    );
    const batch = Number(batchRow.max_batch) + 1;
    const toRun = step ? pending.slice(0, step) : pending;

    for (const file of toRun) {
      const { up } = parseMigrationFile(file);
      if (!up) throw new Error(`Migration "${file}" has an empty UP section.`);
      await conn.query(up);
      await conn.query(
        `INSERT INTO \`${MIGRATIONS_TABLE}\` (migration, batch, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`,
        [file, batch],
      );
      console.log(`Migrated: ${file} (batch ${batch})`);
    }
  } finally {
    await conn.end();
  }
}

export async function runRollback(step?: number) {
  const conn = await connect();
  try {
    await ensureMigrationsTable(conn);

    const [rows] = await conn.query<mysql.RowDataPacket[]>(
      `SELECT migration, batch FROM \`${MIGRATIONS_TABLE}\` ORDER BY id DESC`,
    );
    if (rows.length === 0) {
      console.log("Nothing to rollback.");
      return;
    }

    const lastBatch = Number(rows[0].batch);
    const toRollback = rows.filter((row) => Number(row.batch) === lastBatch);
    const count = step ? Math.min(step, toRollback.length) : toRollback.length;

    for (let i = 0; i < count; i++) {
      const { down } = parseMigrationFile(toRollback[i].migration);
      if (down) await conn.query(down);
      await conn.query(
        `DELETE FROM \`${MIGRATIONS_TABLE}\` WHERE migration = ?`,
        [toRollback[i].migration],
      );
      console.log(`Rolled back: ${toRollback[i].migration}`);
    }
  } finally {
    await conn.end();
  }
}

export async function runFresh() {
  const conn = await connect();
  try {
    await ensureMigrationsTable(conn);

    const [[dbRow]] = await conn.query<mysql.RowDataPacket[]>(`SELECT DATABASE() AS db`);
    const dbName = dbRow.db as string;

    const [tables] = await conn.query<mysql.RowDataPacket[]>(
      `SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ?`,
      [dbName],
    );
    const names = tables.map((t) => `\`${t.TABLE_NAME}\``);

    if (names.length > 0) {
      await conn.query(`SET FOREIGN_KEY_CHECKS = 0`);
      await conn.query(`DROP TABLE IF EXISTS ${names.join(", ")}`);
      await conn.query(`SET FOREIGN_KEY_CHECKS = 1`);
      console.log(`Dropped ${names.length} table(s).`);
    }

    console.log("Database reset.");
  } finally {
    await conn.end();
  }

  await runUp();
}

export async function runSeed() {
  const { seed } = await import("./seed");
  await seed();
}

const HELP = `
Usage: migrate <command> [options]

Commands:
  status             Show applied and pending migrations
  up [count]         Run pending migrations (optionally limited count)
  rollback [count]   Roll back the last migration batch (optionally limited)
  fresh              Drop all tables and re-run every migration
  seed               Run database seeders
`;

export function printHelp() {
  console.log(HELP);
}
