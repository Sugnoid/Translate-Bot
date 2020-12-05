const Keyv = require('keyv');
const hash = require('object-hash');
const config = require('./config/config.json');

class CacheService {
    constructor({ redisUrl, logger }) {
        this.keyv = new Keyv(redisUrl);
        this.keyv.on('error', err => console.error('Keyv connection error:', err));
        this.logger = logger;
    }

    buildKey(serverId, channelId, type, object) {
        return `${serverId}:${channelId}:${type}:${hash(object)}`
    }

    async checkCache(key) {
        let objectHash = hash(object)
        this.logger.debug(`Checking cache: key=${objectHash}`)
        return await this.keyv.get(objectHash)
    }

    async storeAndCheck(key, value, ttl) {
        this.logger.debug(`Storing: key=${key}, value=${value}`);
        let isSet = await this.keyv.set(key, value, ttl);
        let storedValue = await this.keyv.get(key)
        this.logger.debug(`Retrieved: key=${key}, storedValue=${storedValue}`)
        return isSet
    }

    async store(key, object) {
        return await this.storeAndCheck(key, object, config.cache.ttl);
    }
}

module.exports = CacheService;