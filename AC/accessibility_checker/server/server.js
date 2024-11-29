const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const axe = require('axe-core');

const app = express();
const port = 5000;

app.use(express.json());

// Route to check accessibility for a given URL
app.post('/check-url', async (req, res) => {
  const { url } = req.body;
  
  // Use Puppeteer to open the website and check its content
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Inject Axe-core into the page
  await page.evaluate(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.3.5/axe.min.js';
    document.head.appendChild(script);
  });

  // Run Axe-core
  const results = await page.evaluate(async () => {
    return await axe.run();
  });

  await browser.close();

  // Send the results back to the frontend
  res.json(results);
});

// Route to check accessibility for an uploaded HTML file
app.post('/check-file', (req, res) => {
  // Process the uploaded HTML file
  // You can use a library like `multer` to handle file uploads
  res.json({ message: 'File uploaded successfully' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
