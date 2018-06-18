const path = require('path');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const i18nextFSBackend = require('i18next-node-fs-backend');

// Context DOES contain req on the server... how?
i18next
  .use(i18nextMiddleware.LanguageDetector)
  .use(i18nextFSBackend)
  .init({
    debug: true,
    fallbackLng: 'en',
    preload: ['en', 'es'],
    initImmediate: true,
    ns: ['app'], // 'pages', 'message', 'global', etc. - for now only one file, 'app'.
    defaultNS: 'app', // keys in any other name space require prefix: t('pages:home_text') etc
    saveMissing: false,
    backend: {
      loadPath: path.resolve(__dirname, '..', '/locales/{{lng}}/{{ns}}.json'),
      addPath: path.resolve(__dirname, '..', '/locales/{{lng}}/{{ns}}.missing.json'),
      jsonIndent: 2
    },
    detection: {
      // order and from where user language should be detected
      order: [/*'path', 'session', */ 'header', 'querystring', 'cookie'],
      // keys or params to lookup language from
      lookupQuerystring: 'lang',
      lookupCookie: 'i18next',
      lookupSession: 'lng',
      lookupPath: 'lng',
      lookupFromPathIndex: 0,
      // cache user language
      caches: false, // ['cookie']
      // optional expire and domain for set cookie
      cookieExpirationDate: new Date(),
      cookieDomain: '.rolamix.com',
    }
   });

module.exports = () => i18nextMiddleware.handle(i18next, {
  // ignoreRoutes: ["/foo"],
  removeLngFromUrl: false
});
