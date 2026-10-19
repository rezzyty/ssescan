/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

// Initialize Gemini API client on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for flat extraction using Gemini Vision
app.post('/api/extract', async (req, res) => {
  try {
    const { images } = req.body; // Array of { data: base64, mimeType }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'No images provided for extraction.' });
    }

    const allExtractedItems = [];

    for (const img of images) {
      const base64Data = img.data.includes(',') ? img.data.split(',')[1] : img.data;
      const mimeType = img.mimeType || 'image/jpeg';

      const prompt = `
      You are an expert real estate data extraction assistant in Hong Kong.
      Analyze this image of a flat selection result board or sales price schedule.
      Extract all selected or listed flats (estates, blocks, floors, and flat numbers/units) and their exact selection times (if present).
      
      CRITICAL ESTATE NAME MAPPING (You MUST translate English estate names to Chinese):
      - "SIERRA TERRACE" -> "樂嶺軒"
      - "KAI YEUNG COURT" -> "啟陽苑"
      - "HEMMA SAPPHIRE" -> "灝然"
      - "SHING CHI COURT" -> "盛緻苑"
      - "YING FAI COURT" -> "影輝苑"
      - "WUI HEI COURT" -> "匯熙苑"
      - "YAN NGA COURT" -> "欣雅苑"
      - "HIU NGA COURT" -> "曉雅苑"
      - "LONG FUNG COURT" -> "朗風苑"
      - "YU FUNG COURT" -> "裕豐苑"

      Format the flat name strictly as "[Estate Name] [Block]座 [Floor]樓 [Flat]" or standard Chinese format (e.g., "樂嶺軒 29樓 A1", "啟陽苑 A座 36樓 01", "盛緻苑 Shing Chi Court A座 37樓 1單位"). Avoid raw English terms like "Block", "Floor", "Flat".
      
      Return the result as a JSON array of objects with the following keys:
      - "flat": string (formatted flat name in Chinese)
      - "displayTime": string (exact time as shown in image, e.g. "11:55 上午" or "14:30")
      - "isoTime": string (ISO 8601 timestamp e.g. "2026-10-16T11:55:00" or current date fallback if time is missing)
      - "saleableArea": string (sq.m / sq.ft if available)
      - "price": string (price in HKD if available)
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                flat: { type: Type.STRING },
                displayTime: { type: Type.STRING },
                isoTime: { type: Type.STRING },
                saleableArea: { type: Type.STRING },
                price: { type: Type.STRING }
              },
              required: ["flat", "displayTime", "isoTime"]
            }
          }
        }
      });

      if (response.text) {
        try {
          const parsed = JSON.parse(response.text.trim());
          if (Array.isArray(parsed)) {
            allExtractedItems.push(...parsed);
          }
        } catch (parseErr) {
          console.error("JSON parse error from model output:", parseErr, response.text);
        }
      }
    }

    res.json({ success: true, flats: allExtractedItems });
  } catch (err: any) {
    console.error('Extraction API error:', err);
    res.status(500).json({ error: err.message || 'Failed to extract flat data.' });
  }
});

// Setup Vite middleware for development or serve static build for production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: false },
    appType: 'spa'
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
