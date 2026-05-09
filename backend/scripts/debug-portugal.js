const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.FOOTBALL_API_SPORTS_KEY;
const API_URL = process.env.FOOTBALL_API_SPORTS_URL;

const headers = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': 'v3.football.api-sports.io'
};

async function test() {
  const name = 'Portugal';
  const res = await axios.get(`${API_URL}/teams`, { headers, params: { name } });
  console.log('Search results for Portugal:', JSON.stringify(res.data.response, null, 2));
}

test();
