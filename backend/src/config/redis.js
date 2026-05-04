const Redis = require('ioredis');
const logger = require('../utils/logger');

let client = null;

function initRedis() {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  client = new Redis(url);
  client.on('connect', () => logger.info('Redis connected'));
  client.on('error', (err) => logger.error('Redis error', err));
  return client;
}

function getClient() {
  if (!client) initRedis();
  return client;
}

async function cacheGet(key) {
  const c = getClient();
  if (!c) return null;
  const val = await c.get(key);
  return val ? JSON.parse(val) : null;
}

async function cacheSet(key, value, ttlSeconds = 10) {
  const c = getClient();
  if (!c) return null;
  await c.set(key, JSON.stringify(value), 'EX', ttlSeconds);
}

async function cacheDel(key) {
  const c = getClient();
  if (!c) return null;
  await c.del(key);
}

module.exports = { initRedis, getClient, cacheGet, cacheSet, cacheDel };
