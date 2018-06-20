import { Component, Event, EventEmitter, Prop } from '@stencil/core';
// import { InjectProp } from '@engineerapart/ts-universal-inject';
import { TranslateService } from '~services/index';

@Component({
  tag: 'translation-manager',
  styles: `
  translation-manager { visibility: collapse; opacity: 0; width: 0; height: 0; }
  `
})
export class TranslationManager {

  @Event() languageChanged: EventEmitter;

  private _rmx_id = Math.floor(Math.random() * 10000 + 1000);

  get ID() {
    return this._rmx_id;
  }

  // Until we can get a change into Stencil to grab the language from the api request,
  // we won't be able to do this...
  // @Prop({ context: 'isServer' }) isServer: boolean;
  // @Prop({ context: 'req' }) requestLang: boolean;

  // Ensure that in SSR scenarios, this exports the correct value
  // to the serialized HTML for re-hydration on the client.
  @Prop({ mutable: true, reflectToAttr: true })
  public lang: string = 'en';

  @Prop({ context: 'document' })
  private doc!: Document;

  @Prop({ context: 'TranslateService' })
  private translateService: TranslateService;

  // @InjectProp(TTranslateService)
  // private translateService!: TranslateService;

  componentWillLoad() {
    console.log('[TranslationManager] componentWillLoad', this._rmx_id, this.translateService.ID);
    // this function returns { error } but we aren't doing anything with it right now.
    this.translateService.on('languageChanged', this.onLanguageChanged);
  }

  onLanguageChanged = (lang: string) => {
    console.log('[TranslationManager] language changed: ', lang, this.translateService.isInitialized);

    if (this.translateService.isInitialized && this.lang !== lang) {
      // set this on document html tag
      this.doc.querySelector('html').setAttribute('lang', lang);
      // All the app-translate elements on the page can now translate.
      this.languageChanged.emit({ lang });
    }
    this.lang = lang;
  }

  render(): JSX.Element {
    console.log('[TranslationManager] render');
    return null;
  }
}
