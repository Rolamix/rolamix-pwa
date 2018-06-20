import { Component, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import cx from 'classnames';
// import { InjectProp } from '@engineerapart/ts-universal-inject';
import { TranslateService } from '~services/index';

// Also https://codepen.io/sergioandrade/pen/onkub

@Component({
  tag: 'site-header',
  styleUrl: 'site-header.scss'
})
export class AppHeader {

  @Event() menuToggle: EventEmitter;

  // @InjectProp(TTranslateService)
  // private translateService: TranslateService;
  @Prop({ context: 'TranslateService' })
  private translateService: TranslateService;

  // @Prop({ context: 'window' }) private window: Window;
  @Prop() isLoggedIn: boolean = false;
  @Prop() isOpen: boolean = false;
  @State() isMobileSearchboxOpen: boolean = false;
  private searchBox: HTMLRmxInputElement;

  // public componentWillLoad() {}

  toggleMenu(nextState: boolean) {
    this.isOpen = nextState;
    this.menuToggle.emit({ isOpen: nextState });
  }

  @Listen('window:resize')
  onWindowResize() {
    this.toggleMenu(false);
  }

  @Listen('backdropClick')
  onBackdropClick(_event: CustomEvent) {
    this.isOpen = false;
    console.log('header received backdropClick', _event);
  }

  private handleToggleClick = (e: MouseEvent): void => {
    e.preventDefault();
    this.toggleMenu(!this.isOpen);
  }

  toggleMobileSearchbox = (e: MouseEvent) => {
    e.preventDefault();
    this.isMobileSearchboxOpen = !this.isMobileSearchboxOpen;
  }

  // private logoClickHandler(): void {
  //   this.push('/dashboard');
  // }

  // private githubClickHandler(): void {
  //   this.window.open('https://github.com/bfmatei/stencil-boilerplate');
  // }

  captureSearchbox = (sb: HTMLRmxInputElement) => this.searchBox = sb;

  handleSearchSubmit = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    this.executeSearch(this.searchBox.value);
  }

  executeSearch(searchTerm: string) {
    // TBD: Do we close this on searching? I don't think so actually.
    // this.isMobileSearchboxOpen = false;
    console.log('Searching:', searchTerm);
  }

  setLanguage = (lang: string) => {
    return () => {
      this.translateService.setLanguage(lang);
    };
  }

  public render() {
    return (
      <header class={cx('header', { open: this.isOpen })}>

        <div class={cx('ver-mas-cerrado', { active: this.isMobileSearchboxOpen })}>
          <div class="search-link-navigation">
            <button class="clickable-wrapper ver-mas-cerrar" onClick={this.toggleMobileSearchbox}><ion-icon name="md-close" color="text-blue" /></button>
            {/* Handle onValueChange if we want to autosuggest */}
            <rmx-input
              ref={this.captureSearchbox}
              fieldType="text"
              class="site-header search-input"
              value=""
              name="search_field"
              icon="search"
              placeholder="Bandas, Cantantes, Artistas, Música..."
              onInputChange={this.handleSearchSubmit}
            />
            <rmx-button class="round center fit-container submit-search" onClick={this.handleSearchSubmit}>
              Search
            </rmx-button>
            {/* type="submit" id="submit"  name="enviar"  */}
          </div>
        </div>

        <th-route-link class="header-logo" url="/"><app-logo class="logo" /></th-route-link>

        <nav class={cx('menu hide-sm', { open: this.isOpen })}>
          <ul>
            <li class="menu-item"><th-route-link url="/"><app-translate key="header.menu.home" fallback="Home" /></th-route-link></li>
            <li class="menu-item"><th-route-link url="/about"><app-translate key="header.menu.about" fallback="About" /></th-route-link></li>
            <li class="menu-item"><th-route-link url="/espectaculos"><app-translate key="header.menu.espectaculos" fallback="News" /></th-route-link></li>
            <li class="menu-item"><th-route-link url="/promotions"><app-translate key="header.menu.promotions" fallback="Promotions" /></th-route-link></li>
            <li class="menu-item"><th-route-link url="/contacto"><app-translate key="header.menu.contact" fallback="Contact" /></th-route-link></li>
          </ul>

          <ul>
            <li class="menu-item search">
              <button class="clickable-wrapper search" onClick={this.toggleMobileSearchbox}>
              <ion-icon size="small" name="search" />
              <app-translate key="header.menu.search" fallback="Search" />
              </button>
            </li>
            <li class="menu-item"><th-route-link url="/login"><app-translate key="header.menu.login" fallback="Login" /></th-route-link></li>
            <li class="menu-item"><th-route-link url="/signup"><app-translate key="header.menu.signup" fallback="Signup" /></th-route-link></li>
          </ul>
        </nav>

        <button class="clickable-wrapper search" onClick={this.toggleMobileSearchbox}>
          <ion-icon size="medium" name="search" />
        </button>

        <button class={cx('header-icon', { x: this.isOpen })}onClick={this.handleToggleClick}>
          <s class="bar" />
          <s class="bar" />
          <s class="bar" />
        </button>

        <div class="locale-switcher">
          <button class="clickable-wrapper" onClick={this.setLanguage('en')}><img src="/assets/images/locale/en_x64.png" alt="change language to english" /></button>
          <button class="clickable-wrapper" onClick={this.setLanguage('es')}><img src="/assets/images/locale/mx_x64.png" alt="cambiar idioma a español" /></button>
        </div>

      </header>
    );
  }
}


