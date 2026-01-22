import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/reset', (req, res) => res.json({ ok: true }));

app.post('/api/check', (req, res) => {
  const { imageWidth, imageHeight } = req.body;

  const cx = 0.41; // rotated
  const cy = 0.48; // rotated

  res.json({
    correct: true,
    center: {
      x: Math.round(cx * imageWidth),
      y: Math.round(cy * imageHeight)
    }
  });
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname,'public','index.html'));
});

app.listen(3000, ()=>console.log('API http://localhost:3000'));
