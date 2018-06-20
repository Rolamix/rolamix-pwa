import { Component, Listen, Prop, State, Watch } from '@stencil/core';
// import { InjectProp } from '@engineerapart/ts-universal-inject';

import { TranslationMethodOptions } from '~types/services';
import { TranslateService } from '~services/index';

@Component({
  tag: 'app-translate',
  styleUrl: 'app-translate.scss'
})
export class AppTranslate {

  // @Element() private el: HTMLStencilElement;

  // @InjectProp(TTranslateService)
  // private translateService: TranslateService;

  // @Prop({ context: 'isServer' })
  // private isServer: boolean;

  @Prop({ reflectToAttr: true })
  key: string = '';

  @Prop({ reflectToAttr: true })
  fallback: string = '';

  @Prop()
  replace: { [key: string]: any } = {};

  @Prop({ context: 'TranslateService' })
  private translateService: TranslateService;

  // This may look redundant, but this allows us to avoid re-translating
  // when we hydrate from the server. The Prop allows Stencil to hydrate the
  // component with the translated value from the server;
  // The State translation field allows us to translate newly-generated components
  // on the client (navigating to a page for example).
  @Prop({ mutable: true, reflectToAttr: true })
  value: string = '';

  @State()
  translation: string = '';

  @Watch('key')
  @Watch('fallback')
  public entryChangeHandler(): void {
    console.log('[AppTranslate] key/fallback changed');
    this.getTranslation();
  }

  @Listen('body:languageChanged')
  public languageChangedHandler(_ev: CustomEvent): void {
    console.log('[AppTranslate] language changed event');
    this.getTranslation();
  }

  async componentWillLoad() {
    console.log('[AppTranslate] componentWillLoad', this.translateService.ID);
    // if (this.isServer) {
    if (!this.translation && !this.value) { // always true on server
      await this.getTranslation();
    }
    console.log('[AppTranslate] componentWillLoad return');
  }

  private async getTranslation() {
    // Eventually we can add things like count, male/female, interpolation rules etc.
    const options: TranslationMethodOptions = { replace: this.replace };
    console.log('[AppTranslate] Translating: ', this.translateService.ID, this.translateService.ready, this.key, this.fallback);
    await this.translateService.ready;
    console.log('[AppTranslate] awaited, ready: ', this.translateService.isInitialized);
    this.translation = this.translateService.translate(this.key, this.fallback, options);
    this.value = this.translation;
    console.log('[AppTranslate] got translation: ', this.translation);
  }

  // public hostData(): JSXElements.AppTranslateAttributes {
  //   return {
  //     class: {
  //       link: this.url.length > 0
  //     },
  //   };
  // }

  public render() {
    console.log('[AppTranslate] render');
    // I thought about returning something like <span>translation</span>
    // but... why bloat the markup without a good reason.
    return this.value || this.translation;
  }
}
