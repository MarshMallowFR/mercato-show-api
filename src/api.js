const axios = require('axios');
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
require('dotenv/config');

const app = express();
const router = express.Router();

const twitterBaseUrl = 'https://api.twitter.com/2';
const tweetsParams =
  '?tweet.fields=author_id%2Cattachments%2Cid&max_results=5&media.fields=alt_text%2Cheight%2Curl&user.fields=name%2Cprofile_image_url%2Cusername&expansions=attachments.media_keys%2Cauthor_id';

const tweeterHeaders = {
  Authorization: `Bearer ${process.env.API_BEARER_TOKEN}`,
};

const api = async (url, options = {}) => {
  return axios(url, {
    headers: tweeterHeaders,
    ...options,
  });
};

router.get('/users/:id/tweets', async (req, res) => {
  try {
    console.log('totot');
    const { id } = req.params;
    const result = await api(
      `${twitterBaseUrl}/users/${id}/tweets${tweetsParams}`,
    );
    res
      .header({
        'Access-Control-Allow-Origin': '*',
      })
      .status(200)
      .json({ result: result.data });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.use(`/`, router);
app.use(cors);

module.exports = app;
module.exports.handler = serverless(app);
