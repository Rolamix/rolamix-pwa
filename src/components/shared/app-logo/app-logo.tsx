import { Component } from '@stencil/core';

@Component({
  tag: 'app-logo',
  styleUrl: 'app-logo.scss'
})
export class AppLogo {
  public render() {
    // return (
    //   <svg role="img" title="Rolamix Logo" width="100%" height="100%" viewBox="0 0 861.71 200">
    //     <use xlinkHref={`/assets/images/sprite.svg#logo`} />
    //   </svg>
    // );
    return <svg-icon name="logo" />;
  }
}
