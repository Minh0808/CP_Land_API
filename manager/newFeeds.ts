// src/manager/News.ts
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { load } from 'cheerio';

export interface NewsItem {
  title:    string;
  link:     string;
  pubDate:  Date;
  image:    string;
  summary:  string;
}

export interface NewsResult {
  status:     boolean;
  message:    string;
  data?:      NewsItem[];
  statusCode: number;
}

const RSS_URL = 'https://vnexpress.net/rss/bat-dong-san.rss';

export async function fetchHotRealEstate(): Promise<NewsResult> {
  try {
    // 1) Lấy XML
    const response = await axios.get<string>(RSS_URL, {
      responseType: 'text',
      headers: { 'Accept': 'application/rss+xml' }
    });
    const xml = response.data;

    // 2) Parse
    const result = await parseStringPromise(xml, { trim: true });
    const items: any[] = result.rss.channel[0].item || [];

    // 3) Map thành NewsItem
    const news: NewsItem[] = items.slice(0, 12).map(item => {
      const title      = item.title?.[0]   || '';
      const link       = item.link?.[0]    || '';
      const pubDateRaw = item.pubDate?.[0] || '';
      const pubDate    = new Date(pubDateRaw);
      const descHtml   = item.description?.[0] || '';

      const $ = load(descHtml);
      const image   = $('img').first().attr('src') || '';
      $('img').remove();
      const summary = $.root().text().trim();

      return { title, link, pubDate, image, summary };
    });

    return {
      status:     true,
      message:    'FETCH_SUCCESS',
      data:       news,
      statusCode: 200
    };
  } catch (err: any) {
    console.error('[News Manager] Error fetching RSS:', err);
    return {
      status:     false,
      message:    err.message || 'FETCH_FAILED',
      statusCode: err.response?.status || 500
    };
  }
}
