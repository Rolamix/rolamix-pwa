export const i18options = {
  fallbackLng: 'en',
  preload: ['en', 'es'],
  ns: 'translations',
  defaultNS: 'translations',
  // keySeparator: false, // Allow usage of dots in keys
  // nsSeparator: false,
};

export const backendOptions = {
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  addPath: '/locales/add/{{lng}}/{{ns}}',
  init: {
    mode: 'cors',
    credentials: 'same-origin',
    cache: 'default',
  },
};

export const detectionOptions = {
  // order and from where user language should be detected
  order: ['navigator', 'localStorage', 'cookie', 'htmlTag', 'querystring', 'path', 'subdomain'],
  // keys or params to lookup language from
  lookupQuerystring: 'lang',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,
  // cache user language on
  caches: ['localStorage', 'cookie'],
  excludeCacheFor: ['cimode'], // languages to not persist
  // optional expire and domain for set cookie
  cookieMinutes: 1440,
  cookieDomain: '.', // .rolamix.com
};
