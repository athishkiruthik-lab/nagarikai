import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { civicApiRouter } from './src/server/apiMiddleware';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// API routes
app.use('/api', civicApiRouter);

// Serve static frontend files
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NagarikAI Civic Operating System running on http://0.0.0.0:${PORT}`);
});
