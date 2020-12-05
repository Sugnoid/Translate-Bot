var langdetect = require('langdetect');
var DetectLanguage = require('detectlanguage');

class DetectionService {
    constructor({ dl_key, cacheService }) {
        this.detectLang = new DetectLanguage(dl_key);
        this.cacheService = cacheService;
    }

    detectLanguage(text) {
        let res = this.detectLang.detect(text)
        let lang = res[0].language
        if ( lang == 'iw') {
            return 'he'
        } else {
            return lang
        }
    }

    detectLanguageCached(serverId, messageId, text) {
        let cacheKey = this.cacheService.buildKey(serverId, messageId, 'detection', text)
        let cacheVal = this.cacheService.checkCache(cacheKey)
        console.log(`Cache contained: key=${cacheKey}, data="${cacheVal}"`)
        let detection = this.detectLang(text)
        this.cacheService.store(cacheKey, detection)
        return detection
    }

    isMaybeEnglishOffline(text) {
        let result = langdetect.detect(text)
        for (var lang in result) {
            if (lang.lang == 'en') return true
        }
        return false
    }
}

module.exports = DetectionService;