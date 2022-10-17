const headers = {
  'Access-Control-Allow-Origin': 'value',
  Authorization: `Bearer ${process.env.API_BEARER_TOKEN}`,
};

module.exports = {
  headers,
};
