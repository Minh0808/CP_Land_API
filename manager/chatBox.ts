
import axios from 'axios';

export interface GeminiResult {
  status:    boolean;
  message:   string;
  data?: {
    reply: string;
  };
  statusCode: number;
}

async function generateReply(message: string): Promise<GeminiResult> {
  const key   = process.env.GEMINI_API_KEY!;
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const url   = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  try {
    const body = {
      contents: [
        {
          parts: [
            { text: `Bạn là trợ lý CP LAND. ${message}` }
          ]
        }
      ]
    };

    const apiRes = await axios.post(url, body);
    const parts  = apiRes.data.candidates?.[0]?.content?.parts || [];
    const reply  = parts.map((p: any) => p.text).join('');

    return {
      status:     true,
      message:    'SUCCESS',
      data:       { reply },
      statusCode: 200
    };
  } catch (err: any) {
    console.error('Gemini Error:', err.response?.data || err.message);
    return {
      status:     false,
      message:    err.response?.data?.error?.message || err.message,
      statusCode: err.response?.status || 500
    };
  }
}

export default {generateReply}
