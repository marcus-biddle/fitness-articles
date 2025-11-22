import { spawn } from 'child_process';
// import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

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

async function ingest() {
  try {
    const articles = await runScraper();
    console.log(articles);
    // await sendArticlesToOpenAI(articles);
  } catch (error) {
    console.error('Error:', error);
  }
}

ingest();
