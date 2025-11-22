import { spawn } from 'child_process';
// import OpenAI from 'openai';
import dotenv from 'dotenv';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
// import { embeddings } from '../config';
import axios from 'axios';
import * as cheerio from 'cheerio';

dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

function runScraper() {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['../../scraper/scraper.py']);

    let data = '';
    pythonProcess.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    pythonProcess.stderr.on('data', (err) => {
      console.error('Python error:', err.toString());
    });

    pythonProcess.on('close', () => {
      try {
        const articles = JSON.parse(data);
        resolve(articles);
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function sendArticlesToOpenAI(articles) {
  for (const article of articles) {
    const content = `Title: ${article.title}\nURL: ${article.url}\nSummary:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content }],
    });

    console.log('OpenAI response:', completion.choices[0].message.content);
  }
}

export async function scrapePage(url) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    
    // Adjust selector to your target site's article content container
    const article = $('article-section article-section__full').first();

    // Extract paragraphs text
    const paragraphs = article.find('p');
    let content = '';
    paragraphs.each((i, el) => {
      content += $(el).text() + '\n\n';
    });

    return content.trim();
  } catch (error) {
    console.error(`Error scraping article at ${url}:`, error.message);
    return '';
  }
}

async function loadSampleData(articles) {
    for await (const url of articles) {
        const content = await scrapePage(url);
        console.log(content);
        const chunks = await textSplitter.splitText(content);
        // const vectors = await embeddings.embedDocuments(chunks);
    }
}

async function ingest() {
  try {
    // const articles = await runScraper();
    const articles = [
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70169',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70167',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70158',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70165',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70156',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70159',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70161',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70163',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70160',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70157',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70151',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70150',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70147',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70154',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70143',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70146',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70142',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70139',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70138',
  'https://onlinelibrary.wiley.com/doi/10.1111/sms.70135'
]
    console.log(articles);
    await loadSampleData(articles);
    // await sendArticlesToOpenAI(articles);
  } catch (error) {
    console.error('Error:', error);
  }
}

ingest();
