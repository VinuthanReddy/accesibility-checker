const express = require('express');
const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const cors = require('cors'); // Add this line

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

async function runAccessibilityCheck(url) {
  try {
    // Launch a headless browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto(url);

    // Inject axe-core into the page
    await page.evaluate(axeCore.source);

    // Run axe-core accessibility checks
    const results = await page.evaluate(async () => {
      // Run accessibility checks with axe-core on the current page
      return await axe.run();
    });

    await browser.close();
    
    return results;
  } catch (error) {
    console.error('Error running accessibility check:', error);
    throw new Error('Failed to run accessibility check');
  }
}

// Endpoint to run accessibility check
app.get('/accessibility-check', async (req, res) => {
  const url = decodeURIComponent(req.query.url);  // Decode the URL passed as a query parameter

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const results = await runAccessibilityCheck(url);

    // Calculate the accessibility score
    const score = calculateAccessibilityScore(results.violations);

    // Extract suggestions for improvements
    const suggestions = results.violations.map(violation => ({
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl
    }));

    // Send the simplified results
    res.json({
      score,
      suggestions,
      violations: results.violations.length,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while running the accessibility check' });
  }
});

// Function to calculate the accessibility score
function calculateAccessibilityScore(violations) {
  const totalViolations = violations.length;
  let severityScore = 100;  // Start with a perfect score

  // Calculate score based on violations
  violations.forEach(violation => {
    switch (violation.impact) {
      case 'serious':
        severityScore -= 30;  // Deduct points for serious issues
        break;
      case 'moderate':
        severityScore -= 15;  // Deduct points for moderate issues
        break;
      case 'minor':
        severityScore -= 5;   // Deduct points for minor issues
        break;
      default:
        break;
    }
  });

  // Ensure the score is within a valid range (0-100)
  return Math.max(0, Math.min(100, severityScore));
}

// Start the server
app.listen(port, () => {
  console.log(`Accessibility Checker running on http://localhost:${port}`);
});
