const axios = require('axios');
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
require('dotenv/config');

const app = express();
const router = express.Router();
app.use(cors());

const twitterBaseUrl = 'https://api.twitter.com/2';
const tweetsParams =
  '?tweet.fields=author_id%2Cattachments%2Cid%2Ccreated_at&max_results=50&media.fields=alt_text%2Cheight%2Curl&user.fields=name%2Cprofile_image_url%2Cusername%2Cverified&expansions=attachments.media_keys%2Cauthor_id&exclude=replies%2Cretweets';

const tweeterHeaders = {
  Authorization: `Bearer ${process.env.API_BEARER_TOKEN}`,
};

const authorIds = [
  '330262748', // Fabrizio Romano
  '871395668', // Hugo Guillemet
];

const api = async (url, options = {}) => {
  return axios(url, {
    headers: tweeterHeaders,
    ...options,
  });
};

router.get('/users/tweets', async (req, res) => {
  try {
    const promises = [];
    for (const id of authorIds) {
      promises.push(api(`${twitterBaseUrl}/users/${id}/tweets${tweetsParams}`));
    }
    const results = await Promise.all(promises);
    console.log(results[0].data);
    const allResults = results.reduce(
      (acc, { data }) => {
        const currData = data.data;
        const currMedia = data.includes.media;
        const currUsers = data.includes.users;
        return {
          data: acc?.data.concat(currData),
          includes: {
            media: acc.includes.media.concat(currMedia),
            users: acc.includes.users.concat(currUsers),
          },
        };
      },
      {
        data: [],
        includes: {
          media: [],
          users: [],
        },
      },
    );
    res.status(200).json({ result: allResults });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.use(`/`, router);

module.exports = app;
module.exports.handler = serverless(app);
