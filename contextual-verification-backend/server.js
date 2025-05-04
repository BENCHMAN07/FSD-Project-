// server.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB (adjust connection string if needed)
mongoose.connect('mongodb://localhost:27017/contextual_verification', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Optional: Details Schema to store fetched analysis (if needed)
const DetailsSchema = new mongoose.Schema({
  url: String,
  metaTitle: String,
  metaKeywords: String,
  metaDescription: String,
  pageContent: [String],
  scores: Object,
  missingWords: Object,
  fetchedAt: { type: Date, default: Date.now }
});
const Details = mongoose.model('Details', DetailsSchema);

// Basic NLP helper functions
const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'if', 'in', 'on', 'with', 'for', 'to', 'of', 'at', 'by', 'is', 'are'];

function tokenize(text) {
  return text
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .filter(token => token);
}

function calculateNlpScoreAndMissingWords(text, referenceText) {
  const textTokens = tokenize(text);
  const referenceTokens = tokenize(referenceText);
  const numTokens = textTokens.length;
  const nonStopTokens = textTokens.filter(token => !stopWords.includes(token));
  const numNonStopTokens = nonStopTokens.length;
  
  const missingWords = referenceTokens.filter(token =>
    !textTokens.includes(token) && !stopWords.includes(token)
  );
  
  const score = numTokens === 0 ? 0 : Math.min(10, (numNonStopTokens / numTokens) * 10);
  return { score: Number(score.toFixed(2)), missingWords };
}

app.post('/api/fetch_details', async (req, res) => {
  const { url } = req.body;
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const metaTitle = $('title').text().trim() || '';
    const metaKeywords = $('meta[name="keywords"]').attr('content') ? $('meta[name="keywords"]').attr('content').trim() : '';
    const metaDescription = $('meta[name="description"]').attr('content') ? $('meta[name="description"]').attr('content').trim() : '';
    
    const paragraphs = [];
    $('p').each((i, el) => {
      paragraphs.push($(el).text().trim());
    });
    
    const urlResult = calculateNlpScoreAndMissingWords(url, metaTitle);
    const metaTitleResult = calculateNlpScoreAndMissingWords(metaTitle, url);
    const metaKeywordsResult = calculateNlpScoreAndMissingWords(metaKeywords, metaTitle);
    const metaDescriptionResult = calculateNlpScoreAndMissingWords(metaDescription, metaKeywords);
    const pageContentResult = calculateNlpScoreAndMissingWords(paragraphs.join('\n'), metaDescription);
    
    const overallScore = ((urlResult.score + metaTitleResult.score + metaKeywordsResult.score +
      metaDescriptionResult.score + pageContentResult.score) / 5) * 10;
    
    const details = {
      url,
      metaTitle,
      metaKeywords,
      metaDescription,
      pageContent: paragraphs,
      scores: {
        urlScore: urlResult.score,
        metaTitleScore: metaTitleResult.score,
        metaKeywordsScore: metaKeywordsResult.score,
        metaDescriptionScore: metaDescriptionResult.score,
        pageContentScore: pageContentResult.score,
        overallScore: overallScore.toFixed(2) + '%'
      },
      missingWords: {
        urlMissingWords: urlResult.missingWords,
        metaTitleMissingWords: metaTitleResult.missingWords,
        metaKeywordsMissingWords: metaKeywordsResult.missingWords,
        metaDescriptionMissingWords: metaDescriptionResult.missingWords,
        pageContentMissingWords: pageContentResult.missingWords
      }
    };

    // Save the details to MongoDB (optional)
    await Details.create(details);

    res.json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch HTML content from the provided URL." });
  }
});

// Use authentication and report routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/report', require('./routes/report'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));