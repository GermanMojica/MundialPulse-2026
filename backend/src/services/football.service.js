const axios = require('axios');
const cacheService = require('./cache.service');

const API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

const footballApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Auth-Token': API_KEY
  }
});

// Interceptor to handle 429 Rate Limit
footballApi.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 429) {
      console.warn('Rate limit exceeded (429). Retrying in 10 seconds...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      return footballApi(error.config);
    }
    return Promise.reject(error);
  }
);

/**
 * Helper method to fetch from cache, and if stale or empty, fetch from API.
 */
const fetchWithCache = async (cacheKey, ttl, apiCall) => {
  const cached = await cacheService.get(cacheKey);
  
  if (cached && !cached.isStale) {
    return cached.data;
  }

  try {
    const data = await apiCall();
    await cacheService.set(cacheKey, data, ttl);
    return data;
  } catch (error) {
    if (cached && cached.isStale) {
      console.warn(`Serving stale data for ${cacheKey} due to API failure`);
      return cached.data;
    }
    throw error;
  }
};

const getPartidos = async (date) => {
  const query = date ? `?dateFrom=${date}&dateTo=${date}` : '';
  const cacheKey = `partidos_WC_${date || 'all'}`;
  
  return fetchWithCache(cacheKey, 60, async () => {
    if (!API_KEY) return mockMatches;
    
    const response = await footballApi.get(`/competitions/WC/matches${query}`);
    return response.data.matches;
  });
};

const getPartidoById = async (id) => {
  const cacheKey = `partido_${id}`;
  
  const cached = await cacheService.get(cacheKey);
  if (cached && !cached.isStale) return cached.data;

  try {
    if (!API_KEY) return mockMatches.find(m => m.id === parseInt(id));

    const response = await footballApi.get(`/matches/${id}`);
    const match = response.data;
    
    const ttl = match.status === 'IN_PLAY' ? 30 : 3600;
    await cacheService.set(cacheKey, match, ttl);
    return match;
  } catch (error) {
    if (cached && cached.isStale) return cached.data;
    throw error;
  }
};

const getTablaGrupos = async () => {
  const cacheKey = `tabla_grupos_WC`;
  return fetchWithCache(cacheKey, 300, async () => {
    if (!API_KEY) return mockStandings;
    const response = await footballApi.get(`/competitions/WC/standings`);
    return response.data.standings;
  });
};

const getGoleadores = async () => {
  const cacheKey = `goleadores_WC`;
  return fetchWithCache(cacheKey, 300, async () => {
    if (!API_KEY) return mockScorers;
    const response = await footballApi.get(`/competitions/WC/scorers`);
    return response.data.scorers;
  });
};

// --- Mocks Data for Local Testing without API Key ---
const mockMatches = [
  { id: 1, homeTeam: { name: 'Argentina', tla: 'ARG', crest: '🇦🇷' }, awayTeam: { name: 'Brazil', tla: 'BRA', crest: '🇧🇷' }, score: { fullTime: { home: 1, away: 1 } }, status: 'IN_PLAY', utcDate: new Date().toISOString() },
  { id: 2, homeTeam: { name: 'France', tla: 'FRA', crest: '🇫🇷' }, awayTeam: { name: 'England', tla: 'ENG', crest: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, score: { fullTime: { home: null, away: null } }, status: 'TIMED', utcDate: new Date(Date.now() + 3600000).toISOString() },
  { id: 3, homeTeam: { name: 'Spain', tla: 'ESP', crest: '🇪🇸' }, awayTeam: { name: 'Germany', tla: 'GER', crest: '🇩🇪' }, score: { fullTime: { home: 2, away: 0 } }, status: 'FINISHED', utcDate: new Date(Date.now() - 86400000).toISOString() }
];
const mockStandings = [{ group: 'GROUP_A', table: [{ position: 1, team: { name: 'Argentina', crest: '🇦🇷' }, points: 3, playedGames: 1, won: 1, draw: 0, lost: 0 }] }];
const mockScorers = [{ player: { name: 'Lionel Messi' }, team: { crest: '🇦🇷' }, goals: 2 }];

const getPartidosLive = async () => {
  const date = new Date().toISOString().split('T')[0];
  const partidos = await getPartidos(date);
  return partidos.filter(p => p.status === 'IN_PLAY' || p.status === 'PAUSED' || p.status === 'FINISHED');
};

module.exports = {
  getPartidos,
  getPartidoById,
  getTablaGrupos,
  getGoleadores,
  getPartidosLive
};
