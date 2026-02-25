const express = require('express');
const cors = require('cors');
const { init } = require('./db/init');

const generosRouter = require('./routes/generos');
const directoresRouter = require('./routes/directores');
const productorasRouter = require('./routes/productoras');
const tiposRouter = require('./routes/tipos');
const mediaRouter = require('./routes/media');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/generos', generosRouter);
app.use('/api/directores', directoresRouter);
app.use('/api/productoras', productorasRouter);
app.use('/api/tipos', tiposRouter);
app.use('/api/media', mediaRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

async function start() {
  try {
    await init();
    app.listen(PORT, () => {
      console.log(`API escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar:', err.message);
    process.exit(1);
  }
}

start();
