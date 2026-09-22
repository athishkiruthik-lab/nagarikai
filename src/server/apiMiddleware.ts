import { Request, Response, Router } from 'express';
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
} from './geminiService';

export const civicApiRouter = Router();

civicApiRouter.post('/analyze-complaint', async (req: Request, res: Response) => {
  try {
    const { speechText, imageBase64, userLocation, language } = req.body;
    const result = await analyzeCivicComplaint({
      speechText,
      imageBase64,
      userLocation,
      language
    });
    res.json(result);
  } catch (error: any) {
    console.error('API /analyze-complaint error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

civicApiRouter.post('/transcribe-audio', async (req: Request, res: Response) => {
  try {
    const { base64Audio, mimeType, language } = req.body;
    const text = await transcribeCivicAudio({ base64Audio, mimeType, language });
    res.json({ text });
  } catch (error: any) {
    console.error('API /transcribe-audio error:', error);
    res.status(500).json({ error: error.message || 'Audio transcription error' });
  }
});

civicApiRouter.post('/search-web', async (req: Request, res: Response) => {
  try {
    const { query, language } = req.body;
    const result = await searchCivicWeb({ query, language });
    res.json(result);
  } catch (error: any) {
    console.error('API /search-web error:', error);
    res.status(500).json({ error: error.message || 'Web search grounding error' });
  }
});

civicApiRouter.post('/search-maps', async (req: Request, res: Response) => {
  try {
    const { query, lat, lng, language } = req.body;
    const result = await searchCivicMaps({ query, lat, lng, language });
    res.json(result);
  } catch (error: any) {
    console.error('API /search-maps error:', error);
    res.status(500).json({ error: error.message || 'Maps grounding error' });
  }
});

civicApiRouter.post('/generate-video', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, prompt, aspectRatio } = req.body;
    const result = await generateCivicVideo({ imageBase64, mimeType, prompt, aspectRatio });
    res.json(result);
  } catch (error: any) {
    console.error('API /generate-video error:', error);
    res.status(500).json({ error: error.message || 'Video generation error' });
  }
});

civicApiRouter.post('/video-status', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    const status = await checkCivicVideoStatus(operationName);
    res.json(status);
  } catch (error: any) {
    console.error('API /video-status error:', error);
    res.status(500).json({ error: error.message || 'Video status check error' });
  }
});

civicApiRouter.post('/video-download', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    const download = await downloadCivicVideo(operationName);
    if (!download) {
      return res.status(404).json({ error: 'Video download not available' });
    }
    res.setHeader('Content-Type', download.mimeType);
    download.videoRes.body.pipe(res);
  } catch (error: any) {
    console.error('API /video-download error:', error);
    res.status(500).json({ error: error.message || 'Video download error' });
  }
});

civicApiRouter.post('/civic-chat', async (req: Request, res: Response) => {
  try {
    const { message, language, complaintSummary } = req.body;
    const reply = await answerCivicChat(message || '', language || 'en', complaintSummary);
    res.json({ reply });
  } catch (error: any) {
    console.error('API /civic-chat error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

civicApiRouter.post('/generate-insights', async (req: Request, res: Response) => {
  try {
    const { complaints } = req.body;
    const insights = await generateUrbanPlanningInsights(complaints || []);
    res.json(insights);
  } catch (error: any) {
    console.error('API /generate-insights error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

civicApiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'NagarikAI Civic Engine', time: new Date().toISOString() });
});
