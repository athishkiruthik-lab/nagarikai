import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import {
  analyzeCivicComplaint,
  generateUrbanPlanningInsights,
  answerCivicChat,
  transcribeCivicAudio,
  searchCivicWeb,
  searchCivicMaps,
  generateCivicVideo,
  checkCivicVideoStatus,
  downloadCivicVideo
} from './src/server/geminiService';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function civicApiDevPlugin(): Plugin {
  return {
    name: 'civic-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Parse JSON body helper
        const parseBody = (): Promise<any> => {
          return new Promise(resolve => {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch {
                resolve({});
              }
            });
          });
        };

        if (req.url === '/api/analyze-complaint' && req.method === 'POST') {
          const body = await parseBody();
          const result = await analyzeCivicComplaint(body);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
          return;
        }

        if (req.url === '/api/transcribe-audio' && req.method === 'POST') {
          const body = await parseBody();
          const text = await transcribeCivicAudio(body);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ text }));
          return;
        }

        if (req.url === '/api/search-web' && req.method === 'POST') {
          const body = await parseBody();
          const result = await searchCivicWeb(body);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
          return;
        }

        if (req.url === '/api/search-maps' && req.method === 'POST') {
          const body = await parseBody();
          const result = await searchCivicMaps(body);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
          return;
        }

        if (req.url === '/api/generate-video' && req.method === 'POST') {
          const body = await parseBody();
          const result = await generateCivicVideo(body);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
          return;
        }

        if (req.url === '/api/video-status' && req.method === 'POST') {
          const body = await parseBody();
          const status = await checkCivicVideoStatus(body.operationName);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(status));
          return;
        }

        if (req.url === '/api/video-download' && req.method === 'POST') {
          const body = await parseBody();
          const download = await downloadCivicVideo(body.operationName);
          if (!download) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Video not ready' }));
            return;
          }
          res.setHeader('Content-Type', download.mimeType);
          download.videoRes.body.pipe(res);
          return;
        }

        if (req.url === '/api/civic-chat' && req.method === 'POST') {
          const body = await parseBody();
          const reply = await answerCivicChat(body.message || '', body.language || 'en', body.complaintSummary);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ reply }));
          return;
        }

        if (req.url === '/api/generate-insights' && req.method === 'POST') {
          const body = await parseBody();
          const result = await generateUrbanPlanningInsights(body.complaints || []);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
          return;
        }

        if (req.url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), civicApiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
