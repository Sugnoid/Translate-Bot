const redis = require("redis");
const hash = require('object-hash');
const config = require('../config/config.json');

class CacheService {
    constructor({ redisUrl, logger }) {
        console.log(redisUrl)
        this.redis = new redis.createClient(redisUrl);
        this.redis.on('error', err => console.error('redis connection error:', err));
        this.logger = logger;
    }

    buildKey(serverId, channelId, type, object) {
        return `${serverId}:${channelId}:${type}:${hash(object)}`
    }
}

module.exports = CacheService;