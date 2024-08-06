const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = 5000;

const openai = new OpenAIApi(new Configuration({
  apiKey: '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'
}));

app.use(cors());
app.use(express.json());

app.post('/api/products', async (req, res) => {
  const { url } = req.body;

  try {
    const { data } = await axios.get(url);
    const parser = new xml2js.Parser();
    parser.parseString(data, async (err, result) => {
      if (err) {
        res.status(500).send('Error parsing XML');
        return;
      }

      const products = result.urlset.url.slice(0, 5).map(product => {
        const link = product.loc[0];
        const image = product['image:image'][0]['image:loc'][0];
        const title = product['image:image'][0]['image:title'][0];
        return { link, image, title };
      });

      for (const product of products) {
        const { data: pageData } = await axios.get(product.link);
        const plainText = pageData.replace(/<[^>]+>/g, ''); // Remove HTML tags
        
        const completion = await openai.createCompletion({
          model: 'text-davinci-002',
          prompt: `Summarize the following product description in 3-4 bullet points:\n\n${plainText}`,
          max_tokens: 100,
        });

        product.summary = completion.data.choices[0].text.trim();
      }

      res.json(products);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
