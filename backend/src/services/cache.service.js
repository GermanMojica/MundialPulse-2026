const Redis = require('ioredis');

// Fallback to memory if REDIS_URL is not set for local dev testing without Redis
const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      }
    })
  : null;

if (redis) {
  redis.on('error', (err) => {
    console.warn('⚠️ Redis Connection Warning:', err.message);
  });
  
  redis.on('connect', () => {
    // Conexión exitosa (silenciada)
  });
}

/**
 * Gets a value from cache, handling stale fallback logic.
 * @param {string} key 
 * @returns {Promise<{ data: any, isStale: boolean } | null>}
 */
const get = async (key) => {
  if (!redis) return null;
  try {
    const rawData = await redis.get(key);
    if (!rawData) return null;

    const parsed = JSON.parse(rawData);
    
    // Check if the logic TTL has expired
    const isStale = Date.now() > parsed.expiresAt;
    
    return { data: parsed.data, isStale };
  } catch (error) {
    console.error('Redis GET Error:', error);
    return null;
  }
};

/**
 * Sets a value in cache with a logical TTL.
 * Uses a massive actual Redis TTL (e.g., 7 days) to ensure fallback is available.
 * @param {string} key 
 * @param {any} value 
 * @param {number} ttlInSeconds 
 */
const set = async (key, value, ttlInSeconds = 3600) => {
  if (!redis) return;
  try {
    const payload = {
      data: value,
      expiresAt: Date.now() + ttlInSeconds * 1000
    };
    
    // Keep in Redis for 7 days (fallback period)
    await redis.set(key, JSON.stringify(payload), 'EX', 7 * 24 * 60 * 60);
  } catch (error) {
    console.error('Redis SET Error:', error);
  }
};

module.exports = {
  get,
  set
};
