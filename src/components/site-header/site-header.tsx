import { Component, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import cx from 'classnames';

// Also https://codepen.io/sergioandrade/pen/onkub

@Component({
  tag: 'site-header',
  styleUrl: 'site-header.scss'
})
export class AppHeader {

  @Event() menuToggle: EventEmitter;

  // @Prop({ context: 'window' }) private window: Window;
  @Prop() isLoggedIn: boolean = false;
  @Prop() isOpen: boolean = false;
  @State() isMobileSearchboxOpen: boolean = false;

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

  handleV = (v: any) => console.log(v);
  handleC = (v: any) => console.log('complete', v);

  public render() {
    return (
      <header class={cx('header', { open: this.isOpen })}>

        <div class={cx('ver-mas-cerrado', { active: this.isMobileSearchboxOpen })}>
          <form method="POST" class="search-link-navigation">
            <button class="clickable ver-mas-cerrar" onClick={this.toggleMobileSearchbox}><ion-icon name="md-close" color="text-blue" /></button>
            <rmx-input
              fieldType="text"
              class="site-header search-input"
              value=""
              name="search_field"
              icon="search"
              placeholder="Bandas, Cantantes, Artistas, Música..."
              onValueChange={this.handleV}
              onInputChange={this.handleC}
            />
            <rmx-button class="round center fit-container submit-search">Buscar</rmx-button>
            {/* type="submit" id="submit"  name="enviar"  */}
          </form>
        </div>

        <th-route-link class="header-logo" url="/"><app-logo class="logo" /></th-route-link>

        <nav class={cx('menu hide-sm', { open: this.isOpen })}>
          <ul>
            <li class="menu-item"><th-route-link url="/">Home</th-route-link></li>
            <li class="menu-item"><th-route-link url="/about">About</th-route-link></li>
            <li class="menu-item"><th-route-link url="/espectaculos">News</th-route-link></li>
            <li class="menu-item"><th-route-link url="/promotions">Promotions</th-route-link></li>
            <li class="menu-item"><th-route-link url="/contacto">Contact</th-route-link></li>
          </ul>

          <ul>
            <li class="menu-item search"><button class="clickable search" onClick={this.toggleMobileSearchbox}><ion-icon size="small" name="search" />Search</button></li>
            <li class="menu-item"><th-route-link url="/login">Login</th-route-link></li>
            <li class="menu-item"><th-route-link url="/promotions">Signup</th-route-link></li>
          </ul>
        </nav>

        <button class="clickable search" onClick={this.toggleMobileSearchbox}>
          <ion-icon size="medium" name="search" />
        </button>

        <button class={cx('header-icon', { x: this.isOpen })}onClick={this.handleToggleClick}>
          <s class="bar" />
          <s class="bar" />
          <s class="bar" />
        </button>

      </header>
    );
  }
}


