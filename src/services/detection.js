var langdetect = require('langdetect');
var DetectLanguage = require('detectlanguage');

class DetectionService {
    constructor({ dlKey, cacheService }) {
        this.detectLang = new DetectLanguage(dlKey);
        this.cacheService = cacheService;
    }

    async detectLanguage(text) {
        let res = await this.detectLang.detect(text)
        let lang = res[0].language
        if ( lang == 'iw') {
            return 'he'
        } else {
            return lang
        }
    }

    async detectLanguageCached(serverId, messageId, text) {
        let cacheKey = this.cacheService.buildKey(serverId, messageId, 'detection', text)
        console.log(`Cache contained: key=${cacheKey}, data=NOT_IMPLEMENTED`)
        let detection = this.detectLang(text)
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