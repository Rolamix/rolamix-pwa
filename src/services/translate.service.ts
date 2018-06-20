// import { Injectable } from '@engineerapart/ts-universal-inject';
import i18next, { i18n } from 'i18next';
import i18nextFetch from 'i18next-fetch-backend';
import i18LanguageDetector from 'i18next-browser-languagedetector';

import { TranslationMethodOptions } from '~types/services';
import { backendOptions, detectionOptions, i18options } from '../i18n/config.client';

// export const TTranslateService = Symbol.for('Appi18nextService');

// @Injectable({
//   singleton: true,
//   provides: TTranslateService,
// })
export class TranslateService {

  private _id = Math.floor(Math.random() * 10000 + 1000);
  private _currentLang: string = 'en';
  private _isInitialized: boolean = false;
  private _i18nInstance: i18n = null;
  // private translator: i18next.TranslationFunction = null;
  private _readyPromise: Promise<{ error: any; }>;
  // private _readyResolve: any;

  get ID() {
    return this._id;
  }

  get isInitialized() {
    return this._isInitialized;
  }

  get currentLanguage() {
    return this._currentLang;
  }

  get ready() {
    return this._readyPromise;
  }

  constructor(isServer: boolean) {
    console.log('[TranslateService]: ZOMG CONSTRUCTING!!!! <<<<<<<>>>>>>>>');
    // this._readyPromise = new Promise((resolve) => { this._readyResolve = resolve; });
    this.init(isServer);
  }

  setLanguage(lang: string) {
    this._i18nInstance.changeLanguage(lang, (error: any) => {
      if (error) {
        console.warn(`[TranslateService]: Error changing language to [${lang}]:`, error);
        return; // resolve with the error... or show a dialog or something.
      }
      this._currentLang = lang;
      console.log(`[TranslateService]: Successfully changed language to [${lang}]`);
    });
  }

  init(isServer: boolean): Promise<{ error: any; }> {
    this._readyPromise =  new Promise((resolve) => {
      const usei18n = isServer ? i18next.createInstance() : i18next;
      this._i18nInstance = usei18n
        .use(i18nextFetch)
        .use(i18LanguageDetector)
        .init({
          debug: false,
          load: 'languageOnly', // 'all', 'currentOnly'
          ...i18options,
          backend: backendOptions,
          detection: detectionOptions,
        }, (err) => { // ,translateFunc
          if (err) {
            console.warn('[TranslateService]: Error initializing:', err);
          } else {
            this._isInitialized = true;
            console.log('[TranslateService]: Initialized successfully with language:', this._i18nInstance.language);
          }

          this.on('missingKey', (lngs, namespace, key, res) => {
            console.warn(`[TranslateService]: Encountered missing key [${namespace}::${key}]:`, lngs, res);
          });

          this.on('languageChanged', (lng: string) => {
            console.log(`[TranslateService]: Language changed to: [${lng}]`);
          });

          // this._readyResolve({ error: err });
          resolve({ error: err });
        });
    });
    return this._readyPromise;
  }

  translate(key: string, fallback: string, options: TranslationMethodOptions) {
    // Ignore our own _isInitialized value: if i18n says it can translate, let it try!
    if (!this._i18nInstance || !this._i18nInstance.isInitialized) { return fallback || key; }

    return this._i18nInstance.t(key, {
      defaultValue: fallback || null,
      replace: options ? options.replace || {} : {},
    });
  }

  // on(event: 'initialized', callback: (options: InitOptions) => void): void;
  on(event: 'loaded', callback: (loaded: boolean) => void): void;
  on(event: 'failedLoading', callback: (lng: string, ns: string, msg: string) => void): void;
  on(event: 'missingKey', callback: (lngs: string[], namespace: string, key: string, res: string) => void): void;
  on(event: 'added' | 'removed', callback: (lng: string, ns: string) => void): void;
  on(event: 'languageChanged', callback: (lng: string) => void): void;
  on(event: string, listener: (...args: any[]) => void): void {
    i18next.on(event, listener);
  }
}
