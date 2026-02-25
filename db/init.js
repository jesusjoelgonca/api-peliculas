const { run } = require('./connection');

async function init() {
  await run(`
    CREATE TABLE IF NOT EXISTS genero (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      estado TEXT NOT NULL CHECK (estado IN ('Activo', 'Inactivo')),
      descripcion TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await run(`
    CREATE TABLE IF NOT EXISTS director (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombres TEXT NOT NULL,
      estado TEXT NOT NULL CHECK (estado IN ('Activo', 'Inactivo')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await run(`
    CREATE TABLE IF NOT EXISTS productora (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      estado TEXT NOT NULL CHECK (estado IN ('Activo', 'Inactivo')),
      slogan TEXT,
      descripcion TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await run(`
    CREATE TABLE IF NOT EXISTS tipo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await run(`
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      serial TEXT NOT NULL UNIQUE,
      titulo TEXT NOT NULL,
      sinopsis TEXT,
      url TEXT NOT NULL UNIQUE,
      imagen_portada TEXT,
      anio_estreno INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      genero_id INTEGER NOT NULL REFERENCES genero(id),
      director_id INTEGER NOT NULL REFERENCES director(id),
      productora_id INTEGER NOT NULL REFERENCES productora(id),
      tipo_id INTEGER NOT NULL REFERENCES tipo(id)
    )
  `);

  const { get } = require('./connection');
  const countGeneros = await get('SELECT COUNT(*) as n FROM genero');
  if (countGeneros.n === 0) {
    const generos = ['acción', 'aventura', 'ciencia ficción', 'drama', 'terror'];
    for (const nombre of generos) {
      await run(
        'INSERT INTO genero (nombre, estado, descripcion) VALUES (?, ?, ?)',
        [nombre, 'Activo', `Género: ${nombre}`]
      );
    }
  }

  const countTipos = await get('SELECT COUNT(*) as n FROM tipo');
  if (countTipos.n === 0) {
    await run(
      "INSERT INTO tipo (nombre, descripcion) VALUES ('película', 'Contenido tipo película')"
    );
    await run(
      "INSERT INTO tipo (nombre, descripcion) VALUES ('serie', 'Contenido tipo serie')"
    );
  }
}

if (require.main === module) {
  init()
    .then(() => {
      console.log('Base de datos inicializada.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { init };
